from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Product, Category, User, product_schema, products_schema, category_schema, categories_schema
from sqlalchemy import or_, and_
from marshmallow import ValidationError

products_bp = Blueprint('products', __name__)


def is_admin(user_id):
    """Check if user is admin"""
    user = User.query.get(user_id)
    return user and user.is_admin


@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products with optional filtering and pagination"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '').strip()
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        gender = request.args.get('gender', '').strip()
        brand = request.args.get('brand', '').strip()
        featured = request.args.get('featured', type=bool)
        
        # Build query
        query = Product.query.filter(Product.is_active == True)
        
        # Apply filters
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.brand.ilike(search_term)
                )
            )
        
        if min_price:
            query = query.filter(Product.price >= min_price)
        
        if max_price:
            query = query.filter(Product.price <= max_price)
        
        if gender:
            query = query.filter(Product.gender.ilike(f'%{gender}%'))
        
        if brand:
            query = query.filter(Product.brand.ilike(f'%{brand}%'))
        
        if featured is not None:
            query = query.filter(Product.is_featured == featured)
        
        # Apply sorting
        if sort_by == 'price':
            if sort_order == 'asc':
                query = query.order_by(Product.price.asc())
            else:
                query = query.order_by(Product.price.desc())
        elif sort_by == 'name':
            if sort_order == 'asc':
                query = query.order_by(Product.name.asc())
            else:
                query = query.order_by(Product.name.desc())
        else:  # default to created_at
            if sort_order == 'asc':
                query = query.order_by(Product.created_at.asc())
            else:
                query = query.order_by(Product.created_at.desc())
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        products = pagination.items
        
        return jsonify({
            'products': products_schema.dump(products),
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
        return jsonify({'error': 'Failed to get products'}), 500


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product_schema.dump(product)}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product'}), 500


@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'price', 'sku', 'category_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if SKU already exists
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'error': 'SKU already exists'}), 400
        
        # Check if category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Category not found'}), 400
        
        # Create new product
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            sale_price=data.get('sale_price'),
            sku=data['sku'],
            stock_quantity=data.get('stock_quantity', 0),
            category_id=data['category_id'],
            brand=data.get('brand', ''),
            color=data.get('color', ''),
            size=data.get('size', ''),
            material=data.get('material', ''),
            gender=data.get('gender', ''),
            primary_image=data.get('primary_image', ''),
            additional_images=data.get('additional_images', []),
            slug=data.get('slug', ''),
            meta_description=data.get('meta_description', ''),
            tags=data.get('tags', []),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product_schema.dump(product)
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product'}), 500


@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'sale_price' in data:
            product.sale_price = data['sale_price']
        if 'sku' in data:
            # Check if new SKU already exists (for other products)
            existing = Product.query.filter(Product.sku == data['sku'], Product.id != product_id).first()
            if existing:
                return jsonify({'error': 'SKU already exists'}), 400
            product.sku = data['sku']
        if 'stock_quantity' in data:
            product.stock_quantity = data['stock_quantity']
        if 'category_id' in data:
            category = Category.query.get(data['category_id'])
            if not category:
                return jsonify({'error': 'Category not found'}), 400
            product.category_id = data['category_id']
        if 'brand' in data:
            product.brand = data['brand']
        if 'color' in data:
            product.color = data['color']
        if 'size' in data:
            product.size = data['size']
        if 'material' in data:
            product.material = data['material']
        if 'gender' in data:
            product.gender = data['gender']
        if 'primary_image' in data:
            product.primary_image = data['primary_image']
        if 'additional_images' in data:
            product.additional_images = data['additional_images']
        if 'slug' in data:
            product.slug = data['slug']
        if 'meta_description' in data:
            product.meta_description = data['meta_description']
        if 'tags' in data:
            product.tags = data['tags']
        if 'is_featured' in data:
            product.is_featured = data['is_featured']
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product_schema.dump(product)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product'}), 500


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Soft delete by setting is_active to False
        product.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product'}), 500


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()
        return jsonify({'categories': categories_schema.dump(categories)}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get categories'}), 500


@products_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Create a new category (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if category already exists
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'error': 'Category already exists'}), 400
        
        # Create new category
        category = Category(
            name=data['name'],
            description=data.get('description', ''),
            image_url=data.get('image_url', '')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category_schema.dump(category)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create category'}), 500


@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products"""
    try:
        limit = request.args.get('limit', 8, type=int)
        
        products = Product.query.filter_by(
            is_active=True, 
            is_featured=True
        ).order_by(Product.created_at.desc()).limit(limit).all()
        
        return jsonify({'products': products_schema.dump(products)}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get featured products'}), 500


@products_bp.route('/search', methods=['GET'])
def search_products():
    """Search products with advanced filters"""
    try:
        query_text = request.args.get('q', '').strip()
        if not query_text:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Search in name, description, brand, and tags
        search_term = f'%{query_text}%'
        
        products = Product.query.filter(
            and_(
                Product.is_active == True,
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.brand.ilike(search_term)
                )
            )
        ).order_by(Product.created_at.desc()).limit(20).all()
        
        return jsonify({
            'query': query_text,
            'products': products_schema.dump(products),
            'count': len(products)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Search failed'}), 500
