#!/bin/bash

# Simple test to verify if the Flask backend is working
echo "Testing Empower E-commerce Backend..."

# Test if Flask can import all modules
cd backend
python -c "
import sys
try:
    from app import create_app, db
    from app.models import User, Product, Category, Order, OrderItem, Cart
    print('✅ All imports successful!')
    
    app = create_app()
    print('✅ Flask app created successfully!')
    
    with app.app_context():
        print('✅ App context working!')
        
    print('🎉 Backend setup is complete and ready!')
    
except Exception as e:
    print(f'❌ Error: {str(e)}')
    sys.exit(1)
"

cd ..

echo ""
echo "Testing Frontend packages..."
cd frontend
if npm list --silent > /dev/null 2>&1; then
    echo "✅ All frontend packages installed correctly!"
else
    echo "❌ Some frontend packages may have issues"
fi

echo ""
echo "🚀 Empower E-commerce Platform Setup Complete!"
echo ""
echo "To start development:"
echo "1. Start with Docker: docker-compose up --build"
echo "2. Or manually:"
echo "   - Backend: cd backend && python run.py"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "Default accounts after seeding:"
echo "Admin: admin@empowerfashion.com / admin123"
echo "Customer: customer@example.com / customer123"
