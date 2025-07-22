import pytest
from app import create_app, db
from app.models import User, Product, Category, Order


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Create authentication headers for testing."""
    # Register a test user
    user_data = {
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    response = client.post('/api/auth/register', json=user_data)
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}


def test_user_registration(client):
    """Test user registration."""
    user_data = {
        'email': 'newuser@example.com',
        'password': 'password123',
        'first_name': 'New',
        'last_name': 'User'
    }
    response = client.post('/api/auth/register', json=user_data)
    assert response.status_code == 201
    assert 'access_token' in response.json


def test_user_login(client):
    """Test user login."""
    # First register a user
    user_data = {
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    client.post('/api/auth/register', json=user_data)
    
    # Then login
    login_data = {
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    response = client.post('/api/auth/login', json=login_data)
    assert response.status_code == 200
    assert 'access_token' in response.json


def test_products_endpoint(client):
    """Test products endpoint."""
    response = client.get('/api/products')
    assert response.status_code == 200
    assert 'products' in response.json


def test_categories_endpoint(client):
    """Test categories endpoint."""
    response = client.get('/api/products/categories')
    assert response.status_code == 200
    assert 'categories' in response.json
