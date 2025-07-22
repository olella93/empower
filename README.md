# Empower - Fashion E-commerce Platform

A modern, full-stack e-commerce platform for fashion clothing, built with React.js and Python Flask.

## 🚀 Features

### Customer Features
- **Authentication**: User registration and login
- **Product Catalog**: Browse fashion items by categories
- **Shopping Cart**: Add/remove items, view cart summary
- **Checkout**: Secure payment simulation with order processing
- **Order Management**: View order history and status

### Admin Features
- **Product Management**: Full CRUD operations for fashion products
- **User Management**: Manage users and roles
- **Analytics Dashboard**: View product and order analytics
- **Order Management**: Process and track customer orders

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Python Flask** - Web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Flask-CORS** - Cross-origin requests

### Testing
- **Jest** - Frontend testing
- **pytest** - Backend testing

### Development
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration

## 📁 Project Structure

```
empower-ecommerce/
├── backend/                 # Flask API
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── __init__.py
│   ├── migrations/         # Database migrations
│   ├── tests/             # Backend tests
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Application entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
├── docker-compose.yml    # Development environment
└── .github/
    └── copilot-instructions.md
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.9+ (for local backend development)

### Quick Start with Docker
```bash
# Clone the repository
git clone https://github.com/olella93/empower.git
cd empower-ecommerce

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Customer and admin accounts
- **Products**: Fashion items with categories, pricing, and inventory
- **Orders**: Customer purchases with items and payment details
- **Cart**: Shopping cart items for logged-in users

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

### Admin
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: AWS RDS, Heroku Postgres

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for fashion enthusiasts
