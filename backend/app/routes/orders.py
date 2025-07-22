from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Order, OrderItem, Cart, Product, User, order_schema, orders_schema
from datetime import datetime
import uuid
import random

orders_bp = Blueprint('orders', __name__)


def generate_order_number():
    """Generate unique order number"""
    prefix = "EMP"
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    random_suffix = str(random.randint(1000, 9999))
    return f"{prefix}{timestamp}{random_suffix}"


def simulate_payment_processing(payment_data):
    """Simulate payment processing"""
    # In a real application, this would integrate with a payment gateway
    # For MVP, we'll simulate the process
    
    payment_method = payment_data.get('payment_method', 'credit_card')
    
    # Simulate payment validation
    if payment_method == 'credit_card':
        card_number = payment_data.get('card_number', '')
        if len(card_number.replace(' ', '')) < 16:
            return False, "Invalid card number"
        
        expiry_month = payment_data.get('expiry_month')
        expiry_year = payment_data.get('expiry_year')
        if not expiry_month or not expiry_year:
            return False, "Invalid expiry date"
        
        cvv = payment_data.get('cvv', '')
        if len(cvv) < 3:
            return False, "Invalid CVV"
    
    # Simulate 95% success rate
    import random
    if random.random() < 0.95:
        transaction_id = str(uuid.uuid4())
        return True, transaction_id
    else:
        return False, "Payment processing failed"


@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    """Get user's orders"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)
        status = request.args.get('status', '').strip()
        
        # Build query
        query = Order.query.filter_by(user_id=current_user_id)
        
        if status:
            query = query.filter(Order.status == status)
        
        # Order by creation date (newest first)
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


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get specific order details"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user_id
        ).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'order': order_schema.dump(order)}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get order'}), 500


@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """Create new order from cart"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'shipping_address', 'billing_address', 'payment_info'
        ]
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get cart items
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Validate cart items and calculate totals
        order_items_data = []
        subtotal = 0
        
        for cart_item in cart_items:
            product = cart_item.product
            
            if not product or not product.is_active:
                return jsonify({
                    'error': f'Product {product.name if product else "Unknown"} is no longer available'
                }), 400
            
            if product.stock_quantity < cart_item.quantity:
                return jsonify({
                    'error': f'Insufficient stock for {product.name}',
                    'available': product.stock_quantity,
                    'requested': cart_item.quantity
                }), 400
            
            item_total = float(product.current_price) * cart_item.quantity
            subtotal += item_total
            
            order_items_data.append({
                'product': product,
                'quantity': cart_item.quantity,
                'unit_price': product.current_price,
                'total_price': item_total
            })
        
        # Calculate taxes and total
        tax_rate = 0.08  # 8% tax
        tax_amount = round(subtotal * tax_rate, 2)
        shipping_amount = 0  # Free shipping for MVP
        discount_amount = 0  # No discounts for MVP
        total_amount = subtotal + tax_amount + shipping_amount - discount_amount
        
        # Process payment simulation
        payment_success, payment_result = simulate_payment_processing(data['payment_info'])
        
        if not payment_success:
            return jsonify({'error': payment_result}), 400
        
        # Create order
        order = Order(
            user_id=current_user_id,
            order_number=generate_order_number(),
            status='confirmed',
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            discount_amount=discount_amount,
            total_amount=total_amount,
            payment_method=data['payment_info'].get('payment_method', 'credit_card'),
            payment_status='completed',
            transaction_id=payment_result
        )
        
        # Add shipping address
        shipping = data['shipping_address']
        order.shipping_first_name = shipping.get('first_name')
        order.shipping_last_name = shipping.get('last_name')
        order.shipping_address_line1 = shipping.get('address_line1')
        order.shipping_address_line2 = shipping.get('address_line2')
        order.shipping_city = shipping.get('city')
        order.shipping_state = shipping.get('state')
        order.shipping_postal_code = shipping.get('postal_code')
        order.shipping_country = shipping.get('country')
        order.shipping_phone = shipping.get('phone')
        
        # Add billing address
        billing = data['billing_address']
        order.billing_first_name = billing.get('first_name')
        order.billing_last_name = billing.get('last_name')
        order.billing_address_line1 = billing.get('address_line1')
        order.billing_address_line2 = billing.get('address_line2')
        order.billing_city = billing.get('city')
        order.billing_state = billing.get('state')
        order.billing_postal_code = billing.get('postal_code')
        order.billing_country = billing.get('country')
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items and update stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price']
            )
            db.session.add(order_item)
            
            # Update product stock
            item_data['product'].stock_quantity -= item_data['quantity']
        
        # Clear cart
        Cart.query.filter_by(user_id=current_user_id).delete()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order_schema.dump(order)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create order'}), 500


@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    """Cancel an order"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user_id
        ).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        if order.status not in ['pending', 'confirmed']:
            return jsonify({'error': 'Order cannot be cancelled'}), 400
        
        # Update order status
        order.status = 'cancelled'
        
        # Restore product stock
        for order_item in order.order_items:
            if order_item.product:
                order_item.product.stock_quantity += order_item.quantity
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order cancelled successfully',
            'order': order_schema.dump(order)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel order'}), 500


@orders_bp.route('/simulate-payment', methods=['POST'])
def simulate_payment():
    """Simulate payment processing for frontend testing"""
    try:
        data = request.get_json()
        
        # Simulate payment validation
        success, result = simulate_payment_processing(data)
        
        if success:
            return jsonify({
                'success': True,
                'transaction_id': result,
                'message': 'Payment processed successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result
            }), 400
            
    except Exception as e:
        return jsonify({'error': 'Payment simulation failed'}), 500


@orders_bp.route('/invoice/<int:order_id>', methods=['GET'])
@jwt_required()
def get_invoice(order_id):
    """Generate invoice data for an order"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user_id
        ).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Generate invoice data
        invoice_data = {
            'invoice_number': f"INV-{order.order_number}",
            'order': order_schema.dump(order),
            'invoice_date': order.created_at.isoformat(),
            'due_date': order.created_at.isoformat(),  # Already paid
            'company_info': {
                'name': 'Empower Fashion',
                'address': '123 Fashion Avenue',
                'city': 'New York',
                'state': 'NY',
                'postal_code': '10001',
                'phone': '(555) 123-4567',
                'email': 'orders@empowerfashion.com'
            }
        }
        
        return jsonify({'invoice': invoice_data}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate invoice'}), 500
