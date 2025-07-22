from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Cart, Product, User, cart_schema, cart_items_schema
from sqlalchemy import and_

cart_bp = Blueprint('cart', __name__)


@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    """Get current user's cart items"""
    try:
        current_user_id = get_jwt_identity()
        
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        
        # Calculate totals
        subtotal = 0
        total_items = 0
        
        for item in cart_items:
            if item.product and item.product.is_active:
                subtotal += float(item.product.current_price) * item.quantity
                total_items += item.quantity
        
        return jsonify({
            'cart_items': cart_items_schema.dump(cart_items),
            'summary': {
                'total_items': total_items,
                'subtotal': subtotal,
                'estimated_tax': round(subtotal * 0.08, 2),  # 8% tax
                'estimated_total': round(subtotal * 1.08, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get cart'}), 500


@cart_bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('product_id'):
            return jsonify({'error': 'Product ID is required'}), 400
        
        quantity = data.get('quantity', 1)
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        # Check if product exists and is active
        product = Product.query.filter_by(id=data['product_id'], is_active=True).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check stock availability
        if product.stock_quantity < quantity:
            return jsonify({
                'error': 'Insufficient stock',
                'available_stock': product.stock_quantity
            }), 400
        
        # Check if item already exists in cart
        existing_item = Cart.query.filter_by(
            user_id=current_user_id,
            product_id=data['product_id']
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + quantity
            
            # Check total stock availability
            if product.stock_quantity < new_quantity:
                return jsonify({
                    'error': 'Insufficient stock for total quantity',
                    'available_stock': product.stock_quantity,
                    'current_in_cart': existing_item.quantity
                }), 400
            
            existing_item.quantity = new_quantity
            message = 'Cart item updated successfully'
        else:
            # Create new cart item
            cart_item = Cart(
                user_id=current_user_id,
                product_id=data['product_id'],
                quantity=quantity
            )
            db.session.add(cart_item)
            message = 'Item added to cart successfully'
        
        db.session.commit()
        
        # Get updated cart
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        
        return jsonify({
            'message': message,
            'cart_items': cart_items_schema.dump(cart_items)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item to cart'}), 500


@cart_bp.route('/<int:cart_item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(cart_item_id):
    """Update cart item quantity"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Find cart item
        cart_item = Cart.query.filter_by(
            id=cart_item_id,
            user_id=current_user_id
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        # Validate quantity
        quantity = data.get('quantity', cart_item.quantity)
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        # Check stock availability
        if cart_item.product.stock_quantity < quantity:
            return jsonify({
                'error': 'Insufficient stock',
                'available_stock': cart_item.product.stock_quantity
            }), 400
        
        # Update quantity
        cart_item.quantity = quantity
        db.session.commit()
        
        return jsonify({
            'message': 'Cart item updated successfully',
            'cart_item': cart_schema.dump(cart_item)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update cart item'}), 500


@cart_bp.route('/<int:cart_item_id>', methods=['DELETE'])
@jwt_required()
def remove_cart_item(cart_item_id):
    """Remove item from cart"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find cart item
        cart_item = Cart.query.filter_by(
            id=cart_item_id,
            user_id=current_user_id
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        # Remove item
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove cart item'}), 500


@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear all items from cart"""
    try:
        current_user_id = get_jwt_identity()
        
        # Delete all cart items for user
        Cart.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        
        return jsonify({'message': 'Cart cleared successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to clear cart'}), 500


@cart_bp.route('/count', methods=['GET'])
@jwt_required()
def get_cart_count():
    """Get total number of items in cart"""
    try:
        current_user_id = get_jwt_identity()
        
        total_items = db.session.query(db.func.sum(Cart.quantity)).filter_by(
            user_id=current_user_id
        ).scalar() or 0
        
        return jsonify({'count': total_items}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get cart count'}), 500


@cart_bp.route('/validate', methods=['POST'])
@jwt_required()
def validate_cart():
    """Validate cart items before checkout"""
    try:
        current_user_id = get_jwt_identity()
        
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        
        validation_errors = []
        valid_items = []
        
        for item in cart_items:
            if not item.product or not item.product.is_active:
                validation_errors.append({
                    'cart_item_id': item.id,
                    'error': 'Product is no longer available'
                })
            elif item.product.stock_quantity < item.quantity:
                validation_errors.append({
                    'cart_item_id': item.id,
                    'product_name': item.product.name,
                    'requested_quantity': item.quantity,
                    'available_stock': item.product.stock_quantity,
                    'error': 'Insufficient stock'
                })
            else:
                valid_items.append(item)
        
        # Calculate totals for valid items
        subtotal = sum(float(item.product.current_price) * item.quantity for item in valid_items)
        
        return jsonify({
            'valid': len(validation_errors) == 0,
            'validation_errors': validation_errors,
            'valid_items': cart_items_schema.dump(valid_items),
            'summary': {
                'subtotal': subtotal,
                'tax': round(subtotal * 0.08, 2),
                'total': round(subtotal * 1.08, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to validate cart'}), 500
