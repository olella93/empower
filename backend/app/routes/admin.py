from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Product, Order, OrderItem, Category, user_schema, users_schema, order_schema, orders_schema
from sqlalchemy import func, and_, extract
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)


def is_admin(user_id):
    """Check if user is admin"""
    user = User.query.get(user_id)
    return user and user.is_admin


def require_admin(f):
    """Decorator to require admin access"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        # Get date ranges
        today = datetime.utcnow().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        year_ago = today - timedelta(days=365)
        
        # Total counts
        total_users = User.query.count()
        total_products = Product.query.filter_by(is_active=True).count()
        total_orders = Order.query.count()
        total_revenue = db.session.query(func.sum(Order.total_amount)).scalar() or 0
        
        # Recent stats (last 30 days)
        recent_users = User.query.filter(User.created_at >= month_ago).count()
        recent_orders = Order.query.filter(Order.created_at >= month_ago).count()
        recent_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= month_ago
        ).scalar() or 0
        
        # Order status distribution
        order_status_stats = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).group_by(Order.status).all()
        
        order_status_data = {status: count for status, count in order_status_stats}
        
        # Top selling products (by quantity)
        top_products = db.session.query(
            Product.name,
            Product.id,
            func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem).group_by(Product.id, Product.name).order_by(
            func.sum(OrderItem.quantity).desc()
        ).limit(5).all()
        
        top_products_data = [
            {
                'product_id': product_id,
                'product_name': name,
                'total_sold': int(total_sold)
            }
            for name, product_id, total_sold in top_products
        ]
        
        # Revenue by month (last 6 months)
        six_months_ago = today - timedelta(days=180)
        monthly_revenue = db.session.query(
            extract('year', Order.created_at).label('year'),
            extract('month', Order.created_at).label('month'),
            func.sum(Order.total_amount).label('revenue')
        ).filter(
            Order.created_at >= six_months_ago,
            Order.payment_status == 'completed'
        ).group_by('year', 'month').order_by('year', 'month').all()
        
        monthly_revenue_data = [
            {
                'month': f"{int(year)}-{int(month):02d}",
                'revenue': float(revenue)
            }
            for year, month, revenue in monthly_revenue
        ]
        
        return jsonify({
            'totals': {
                'users': total_users,
                'products': total_products,
                'orders': total_orders,
                'revenue': float(total_revenue)
            },
            'recent_stats': {
                'new_users': recent_users,
                'new_orders': recent_orders,
                'recent_revenue': float(recent_revenue)
            },
            'order_status_distribution': order_status_data,
            'top_products': top_products_data,
            'monthly_revenue': monthly_revenue_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get dashboard stats'}), 500


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users with pagination"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search = request.args.get('search', '').strip()
        role_filter = request.args.get('role', '').strip()  # admin, customer
        
        # Build query
        query = User.query
        
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                db.or_(
                    User.email.ilike(search_term),
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term)
                )
            )
        
        if role_filter == 'admin':
            query = query.filter(User.is_admin == True)
        elif role_filter == 'customer':
            query = query.filter(User.is_admin == False)
        
        # Order by creation date
        query = query.order_by(User.created_at.desc())
        
        # Paginate
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        users = pagination.items
        
        return jsonify({
            'users': users_schema.dump(users),
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get users'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user information (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'is_admin' in data:
            user.is_admin = data['is_admin']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user_schema.dump(user)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user'}), 500


@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    """Get all orders for admin management"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status_filter = request.args.get('status', '').strip()
        search = request.args.get('search', '').strip()
        
        # Build query
        query = Order.query
        
        if status_filter:
            query = query.filter(Order.status == status_filter)
        
        if search:
            search_term = f'%{search}%'
            query = query.join(User).filter(
                db.or_(
                    Order.order_number.ilike(search_term),
                    User.email.ilike(search_term),
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term)
                )
            )
        
        # Order by creation date
        query = query.order_by(Order.created_at.desc())
        
        # Paginate
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        orders = pagination.items
        
        return jsonify({
            'orders': orders_schema.dump(orders),
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get orders'}), 500


@admin_bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Update status and timestamps
        order.status = new_status
        
        if new_status == 'shipped' and not order.shipped_at:
            order.shipped_at = datetime.utcnow()
        elif new_status == 'delivered' and not order.delivered_at:
            order.delivered_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order_schema.dump(order)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update order status'}), 500


@admin_bp.route('/analytics/products', methods=['GET'])
@jwt_required()
def get_product_analytics():
    """Get detailed product analytics"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        # Get date range
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Top selling products
        top_products = db.session.query(
            Product.id,
            Product.name,
            Product.category_id,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.total_price).label('total_revenue')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= start_date,
            Order.payment_status == 'completed'
        ).group_by(
            Product.id, Product.name, Product.category_id
        ).order_by(func.sum(OrderItem.quantity).desc()).limit(10).all()
        
        # Low stock products
        low_stock_products = Product.query.filter(
            and_(
                Product.is_active == True,
                Product.stock_quantity <= 10
            )
        ).order_by(Product.stock_quantity.asc()).limit(20).all()
        
        # Category performance
        category_performance = db.session.query(
            Category.id,
            Category.name,
            func.count(OrderItem.id).label('items_sold'),
            func.sum(OrderItem.total_price).label('revenue')
        ).join(Product).join(OrderItem).join(Order).filter(
            Order.created_at >= start_date,
            Order.payment_status == 'completed'
        ).group_by(Category.id, Category.name).order_by(
            func.sum(OrderItem.total_price).desc()
        ).all()
        
        return jsonify({
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': datetime.utcnow().isoformat(),
                'days': days
            },
            'top_products': [
                {
                    'product_id': product_id,
                    'product_name': name,
                    'category_id': category_id,
                    'total_sold': int(total_sold),
                    'total_revenue': float(total_revenue)
                }
                for product_id, name, category_id, total_sold, total_revenue in top_products
            ],
            'low_stock_products': [
                {
                    'id': product.id,
                    'name': product.name,
                    'stock_quantity': product.stock_quantity,
                    'category': product.category.name if product.category else None
                }
                for product in low_stock_products
            ],
            'category_performance': [
                {
                    'category_id': category_id,
                    'category_name': name,
                    'items_sold': int(items_sold),
                    'revenue': float(revenue)
                }
                for category_id, name, items_sold, revenue in category_performance
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product analytics'}), 500


@admin_bp.route('/analytics/orders', methods=['GET'])
@jwt_required()
def get_order_analytics():
    """Get detailed order analytics"""
    try:
        current_user_id = get_jwt_identity()
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        # Get date range
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Order statistics
        total_orders = Order.query.filter(Order.created_at >= start_date).count()
        completed_orders = Order.query.filter(
            and_(
                Order.created_at >= start_date,
                Order.payment_status == 'completed'
            )
        ).count()
        
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            and_(
                Order.created_at >= start_date,
                Order.payment_status == 'completed'
            )
        ).scalar() or 0
        
        average_order_value = total_revenue / completed_orders if completed_orders > 0 else 0
        
        # Daily order counts
        daily_orders = db.session.query(
            func.date(Order.created_at).label('date'),
            func.count(Order.id).label('order_count'),
            func.sum(Order.total_amount).label('daily_revenue')
        ).filter(
            Order.created_at >= start_date
        ).group_by(func.date(Order.created_at)).order_by('date').all()
        
        # Order status distribution
        status_distribution = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).filter(Order.created_at >= start_date).group_by(Order.status).all()
        
        # Payment method distribution
        payment_distribution = db.session.query(
            Order.payment_method,
            func.count(Order.id).label('count')
        ).filter(Order.created_at >= start_date).group_by(Order.payment_method).all()
        
        return jsonify({
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': datetime.utcnow().isoformat(),
                'days': days
            },
            'summary': {
                'total_orders': total_orders,
                'completed_orders': completed_orders,
                'total_revenue': float(total_revenue),
                'average_order_value': float(average_order_value),
                'conversion_rate': (completed_orders / total_orders * 100) if total_orders > 0 else 0
            },
            'daily_orders': [
                {
                    'date': date.isoformat(),
                    'order_count': int(order_count),
                    'daily_revenue': float(daily_revenue or 0)
                }
                for date, order_count, daily_revenue in daily_orders
            ],
            'status_distribution': {
                status: int(count) for status, count in status_distribution
            },
            'payment_distribution': {
                payment_method: int(count) for payment_method, count in payment_distribution
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get order analytics'}), 500
