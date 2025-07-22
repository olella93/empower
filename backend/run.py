from app import create_app, db
from app.models import User, Product, Category, Order, OrderItem, Cart

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
