from app import db, ma
from datetime import datetime
import bcrypt
from sqlalchemy.orm import relationship


class User(db.Model):
    """User model for authentication and user management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20))
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = relationship('Order', backref='user', lazy=True)
    cart_items = relationship('Cart', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def __repr__(self):
        return f'<User {self.email}>'


class Category(db.Model):
    """Product category model"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = relationship('Product', backref='category', lazy=True)
    
    def __repr__(self):
        return f'<Category {self.name}>'


class Product(db.Model):
    """Product model for fashion items"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    sale_price = db.Column(db.Numeric(10, 2))
    sku = db.Column(db.String(50), unique=True, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    
    # Product details
    brand = db.Column(db.String(80))
    color = db.Column(db.String(50))
    size = db.Column(db.String(20))
    material = db.Column(db.String(100))
    gender = db.Column(db.String(20))  # Men, Women, Unisex
    
    # Images and media
    primary_image = db.Column(db.String(200))
    additional_images = db.Column(db.JSON)  # Array of image URLs
    
    # SEO and metadata
    slug = db.Column(db.String(150), unique=True)
    meta_description = db.Column(db.String(160))
    tags = db.Column(db.JSON)  # Array of tags
    
    # Status and timestamps
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = relationship('OrderItem', backref='product', lazy=True)
    cart_items = relationship('Cart', backref='product', lazy=True)
    
    @property
    def current_price(self):
        """Return sale price if available, otherwise regular price"""
        return self.sale_price if self.sale_price else self.price
    
    @property
    def is_on_sale(self):
        """Check if product is on sale"""
        return self.sale_price is not None and self.sale_price < self.price
    
    def __repr__(self):
        return f'<Product {self.name}>'


class Order(db.Model):
    """Order model for customer purchases"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    
    # Order status
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, processing, shipped, delivered, cancelled
    
    # Pricing
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    shipping_amount = db.Column(db.Numeric(10, 2), default=0)
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Shipping information
    shipping_first_name = db.Column(db.String(80))
    shipping_last_name = db.Column(db.String(80))
    shipping_address_line1 = db.Column(db.String(200))
    shipping_address_line2 = db.Column(db.String(200))
    shipping_city = db.Column(db.String(100))
    shipping_state = db.Column(db.String(100))
    shipping_postal_code = db.Column(db.String(20))
    shipping_country = db.Column(db.String(100))
    shipping_phone = db.Column(db.String(20))
    
    # Billing information
    billing_first_name = db.Column(db.String(80))
    billing_last_name = db.Column(db.String(80))
    billing_address_line1 = db.Column(db.String(200))
    billing_address_line2 = db.Column(db.String(200))
    billing_city = db.Column(db.String(100))
    billing_state = db.Column(db.String(100))
    billing_postal_code = db.Column(db.String(20))
    billing_country = db.Column(db.String(100))
    
    # Payment information (simulated)
    payment_method = db.Column(db.String(50), default='credit_card')
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    transaction_id = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    # Relationships
    order_items = relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Order {self.order_number}>'


class OrderItem(db.Model):
    """Order item model for products in an order"""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    def __repr__(self):
        return f'<OrderItem {self.product.name} x {self.quantity}>'


class Cart(db.Model):
    """Shopping cart model"""
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Ensure unique combination of user and product
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_cart'),)
    
    def __repr__(self):
        return f'<Cart {self.user.email} - {self.product.name}>'


# Marshmallow schemas for serialization
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True

class ProductSchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema, only=['id', 'name'])
    current_price = ma.Method('get_current_price')
    is_on_sale = ma.Method('get_is_on_sale')
    
    class Meta:
        model = Product
        load_instance = True
    
    def get_current_price(self, obj):
        return float(obj.current_price)
    
    def get_is_on_sale(self, obj):
        return obj.is_on_sale

class OrderItemSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema, only=['id', 'name', 'primary_image', 'current_price'])
    
    class Meta:
        model = OrderItem
        load_instance = True

class OrderSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSchema, only=['id', 'email', 'first_name', 'last_name'])
    order_items = ma.Nested(OrderItemSchema, many=True)
    
    class Meta:
        model = Order
        load_instance = True

class CartSchema(ma.SQLAlchemyAutoSchema):
    product = ma.Nested(ProductSchema, only=['id', 'name', 'primary_image', 'current_price', 'stock_quantity'])
    
    class Meta:
        model = Cart
        load_instance = True

# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
cart_schema = CartSchema()
cart_items_schema = CartSchema(many=True)
