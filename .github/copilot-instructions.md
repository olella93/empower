<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Empower E-commerce Platform - Copilot Instructions

## Project Overview
This is a full-stack fashion e-commerce platform called "Empower" built with React.js frontend and Python Flask backend.

## Tech Stack
- **Frontend**: React.js, Redux Toolkit, Material-UI, React Router
- **Backend**: Python Flask, SQLAlchemy, PostgreSQL, JWT authentication
- **Testing**: Jest (frontend), pytest (backend)
- **Development**: Docker, Docker Compose

## Code Style Guidelines

### Frontend (React.js)
- Use functional components with hooks
- Follow Material-UI design patterns
- Use Redux Toolkit for state management with createSlice and createAsyncThunk
- Implement proper error handling and loading states
- Use TypeScript-style prop definitions where applicable
- Follow React best practices for component structure

### Backend (Python Flask)
- Follow PEP 8 style guidelines
- Use SQLAlchemy models for database operations
- Implement JWT authentication for protected routes
- Use Flask blueprints for route organization
- Include proper error handling and validation
- Follow RESTful API design principles

### Database
- Use PostgreSQL with SQLAlchemy ORM
- Follow proper naming conventions (snake_case)
- Include proper relationships and constraints
- Use migrations for schema changes

### General Guidelines
- Write descriptive commit messages
- Include proper error handling
- Add comments for complex logic
- Follow security best practices
- Implement proper validation for all inputs
- Use environment variables for configuration

## Key Features to Implement
1. User authentication and authorization
2. Product catalog with categories and search
3. Shopping cart functionality
4. Checkout process with payment simulation
5. Admin dashboard for product and user management
6. Analytics for products and orders
7. Responsive design for mobile compatibility

## Security Considerations
- Implement JWT token-based authentication
- Validate all inputs on both frontend and backend
- Use HTTPS in production
- Implement proper CORS configuration
- Hash passwords using bcrypt
- Sanitize all database queries
