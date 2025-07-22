from app import create_app, db
from app.models import User, Category, Product
from faker import Faker
import random

fake = Faker()

def create_sample_data():
    """Create sample data for the application"""
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        print("Creating sample data...")
        
        # Create admin user
        admin = User(
            email='admin@empowerfashion.com',
            first_name='Admin',
            last_name='User',
            phone='555-0123',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create sample customer
        customer = User(
            email='customer@example.com',
            first_name='John',
            last_name='Doe',
            phone='555-0456'
        )
        customer.set_password('customer123')
        db.session.add(customer)
        
        # Create categories
        categories_data = [
            {'name': 'Dresses', 'description': 'Elegant dresses for all occasions'},
            {'name': 'Tops', 'description': 'Stylish tops and blouses'},
            {'name': 'Bottoms', 'description': 'Pants, jeans, and skirts'},
            {'name': 'Outerwear', 'description': 'Jackets, coats, and blazers'},
            {'name': 'Accessories', 'description': 'Bags, jewelry, and more'},
            {'name': 'Shoes', 'description': 'Footwear for every style'},
            {'name': 'Activewear', 'description': 'Athletic and workout clothing'}
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            categories.append(category)
            db.session.add(category)
        
        db.session.commit()
        
        # Create sample products
        brands = ['Empower', 'StyleCo', 'UrbanChic', 'ElegantWear', 'ModernStyle']
        colors = ['Black', 'White', 'Navy', 'Red', 'Blue', 'Green', 'Gray', 'Pink', 'Purple', 'Brown']
        sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        materials = ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen', 'Cashmere']
        genders = ['Women', 'Men', 'Unisex']
        
        products_data = [
            # Dresses
            {'name': 'Elegant Evening Dress', 'category': 'Dresses', 'price': 129.99},
            {'name': 'Casual Summer Dress', 'category': 'Dresses', 'price': 79.99},
            {'name': 'Professional Work Dress', 'category': 'Dresses', 'price': 99.99},
            {'name': 'Floral Maxi Dress', 'category': 'Dresses', 'price': 89.99},
            
            # Tops
            {'name': 'Classic White Blouse', 'category': 'Tops', 'price': 49.99},
            {'name': 'Casual T-Shirt', 'category': 'Tops', 'price': 24.99},
            {'name': 'Silk Camisole', 'category': 'Tops', 'price': 69.99},
            {'name': 'Knit Sweater', 'category': 'Tops', 'price': 79.99},
            
            # Bottoms
            {'name': 'High-Waisted Jeans', 'category': 'Bottoms', 'price': 89.99},
            {'name': 'Pencil Skirt', 'category': 'Bottoms', 'price': 59.99},
            {'name': 'Wide-Leg Trousers', 'category': 'Bottoms', 'price': 79.99},
            {'name': 'Denim Shorts', 'category': 'Bottoms', 'price': 39.99},
            
            # Outerwear
            {'name': 'Leather Jacket', 'category': 'Outerwear', 'price': 199.99},
            {'name': 'Wool Coat', 'category': 'Outerwear', 'price': 249.99},
            {'name': 'Denim Jacket', 'category': 'Outerwear', 'price': 89.99},
            {'name': 'Blazer', 'category': 'Outerwear', 'price': 129.99},
            
            # Accessories
            {'name': 'Designer Handbag', 'category': 'Accessories', 'price': 159.99},
            {'name': 'Statement Necklace', 'category': 'Accessories', 'price': 39.99},
            {'name': 'Leather Belt', 'category': 'Accessories', 'price': 49.99},
            {'name': 'Silk Scarf', 'category': 'Accessories', 'price': 29.99},
            
            # Shoes
            {'name': 'High Heel Pumps', 'category': 'Shoes', 'price': 119.99},
            {'name': 'Casual Sneakers', 'category': 'Shoes', 'price': 79.99},
            {'name': 'Ankle Boots', 'category': 'Shoes', 'price': 139.99},
            {'name': 'Sandals', 'category': 'Shoes', 'price': 59.99},
            
            # Activewear
            {'name': 'Yoga Leggings', 'category': 'Activewear', 'price': 49.99},
            {'name': 'Sports Bra', 'category': 'Activewear', 'price': 34.99},
            {'name': 'Athletic Tank Top', 'category': 'Activewear', 'price': 29.99},
            {'name': 'Running Shorts', 'category': 'Activewear', 'price': 39.99}
        ]
        
        for product_data in products_data:
            # Find category
            category = next(c for c in categories if c.name == product_data['category'])
            
            # Create product
            product = Product(
                name=product_data['name'],
                description=fake.text(max_nb_chars=200),
                price=product_data['price'],
                sale_price=product_data['price'] * 0.8 if random.choice([True, False]) else None,
                sku=fake.unique.bothify(text='EMP-####-???').upper(),
                stock_quantity=random.randint(5, 100),
                category_id=category.id,
                brand=random.choice(brands),
                color=random.choice(colors),
                size=random.choice(sizes),
                material=random.choice(materials),
                gender=random.choice(genders),
                primary_image=f'https://picsum.photos/400/500?random={random.randint(1, 1000)}',
                additional_images=[
                    f'https://picsum.photos/400/500?random={random.randint(1001, 2000)}',
                    f'https://picsum.photos/400/500?random={random.randint(2001, 3000)}'
                ],
                slug=product_data['name'].lower().replace(' ', '-'),
                meta_description=f"{product_data['name']} - {fake.sentence(nb_words=10)}",
                tags=['fashion', 'clothing', category.name.lower()],
                is_featured=random.choice([True, False])
            )
            db.session.add(product)
        
        db.session.commit()
        print("Sample data created successfully!")
        print(f"Admin email: admin@empowerfashion.com")
        print(f"Admin password: admin123")
        print(f"Customer email: customer@example.com")
        print(f"Customer password: customer123")

if __name__ == '__main__':
    create_sample_data()
