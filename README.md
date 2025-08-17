# Mini Vutto - Used Bike Listings Platform

A full-stack web application for listing and browsing used bikes, built with Node.js, Express, PostgreSQL, and modern web technologies. This platform allows users to register, list bikes for sale, browse listings, and manage their bike inventory.

## 🚀 Features

- **User Authentication & Authorization**: Secure login/registration with JWT tokens and role-based access control
- **Bike Listings Management**: Create, view, update, and delete bike listings with full CRUD operations
- **User Profile Management**: Update user information including first name and last name
- **Advanced Search & Filtering**: Search bikes by brand, model, or general terms
- **Image Support**: Handle bike photos and image URLs
- **Email Notifications**: SendGrid integration for OTP verification and email services
- **Database Management**: PostgreSQL with comprehensive schema and migrations
- **Security Features**: Password hashing, JWT authentication, input validation
- **RESTful API**: Well-structured endpoints following REST principles

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs for password hashing
- **Email Service**: SendGrid for transactional emails
- **File Handling**: Multer for file uploads
- **Validation**: Input validation and sanitization
- **Security**: CORS, environment-based configuration

### Development Tools
- **Package Manager**: npm
- **Development Server**: nodemon for auto-reload
- **Environment Management**: dotenv for configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/windows/) (v12 or higher)
- [Git](https://git-scm.com/)

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/lokeshmehra09/mini-vutto.git
cd mini-vutto
```

### Step 2: Set Up Environment Configuration

Create a `backend/env.config` file with your configuration:

```bash
# Navigate to backend directory
cd backend

# Create env.config file (Windows)
echo. > env.config
```

Add the following content to `backend/env.config`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_vutto
DB_USER=mini_vutto
DB_PASSWORD=minivutto

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (SendGrid - Professional email service)
SENDGRID_API_KEY=your-sendgrid-api-key-here
VERIFIED_SENDER=your-verified-sender-email@example.com
```

**Important**: Replace the placeholder values with your actual configuration:
- `JWT_SECRET`: Generate a strong random string (use a password generator)
- `SENDGRID_API_KEY`: Get from [SendGrid Dashboard](https://app.sendgrid.com/)
- `VERIFIED_SENDER`: Your verified SendGrid sender email

### Step 3: Set Up PostgreSQL Database

Since you're running PostgreSQL directly on Windows:

1. **Install PostgreSQL** (if not already installed):
   - Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
   - Or use [Chocolatey](https://chocolatey.org/): `choco install postgresql`

2. **Create Database and User**:
   ```sql
   -- Connect to PostgreSQL as superuser (usually 'postgres')
   -- Create database
   CREATE DATABASE mini_vutto;
   
   -- Create user
   CREATE USER mini_vutto WITH PASSWORD 'minivutto';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE mini_vutto TO mini_vutto;
   ```

3. **Run Database Schema**:
   ```bash
   # Navigate to backend/database directory
   cd backend/database
   
   # Run the schema file
   psql -U mini_vutto -d mini_vutto -f schema.sql
   ```

4. **Verify Connection**:
   - Use your existing `connect-db.bat` script
   - Or connect manually: `psql -U mini_vutto -d mini_vutto`

### Step 4: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install
```

### Step 5: Run the Application

```bash
# Start the development server
npm run dev

# Or start in production mode
npm start
```

The server will start on `http://localhost:5000`

## 📱 API Endpoints

### Base URL: `http://localhost:5000`

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `GET` | `/auth/users` | Get all users | ✅ |
| `GET` | `/auth/users/:id` | Get user profile | ✅ |
| `PUT` | `/auth/users/:id` | Update user info | ❌ |
| `PATCH` | `/auth/users/:id/role` | Update user role | ❌ |
| `PATCH` | `/auth/users/:id/verify` | Update verification status | ❌ |
| `DELETE` | `/auth/users/:id` | Delete user | ❌ |

### Bike Endpoints (`/bikes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/bikes` | Get all bikes (with search) | ❌ |
| `GET` | `/bikes/my/listings` | Get user's own listings | ✅ |
| `GET` | `/bikes/:id` | Get single bike | ❌ |
| `POST` | `/bikes` | Create new bike listing | ✅ |
| `PUT` | `/bikes/:id` | Update bike listing | ✅ |
| `DELETE` | `/bikes/:id` | Delete bike listing | ✅ |

### Health Check
- `GET /` - API health check and endpoint information

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "customer|seller",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

### User Roles
- **`customer`**: Can browse bikes and manage profile
- **`seller`**: Can create, update, and delete bike listings

### Protected Routes
Routes marked with `authenticateToken` middleware require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bikes Table
```sql
CREATE TABLE bikes (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    kilometers_driven INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Verification Tokens Table
```sql
CREATE TABLE verification_tokens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Usage Examples

### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "seller"
}
```

### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Update User Information
```http
PUT /auth/users/4
Content-Type: application/json

{
  "first_name": "Lokesh",
  "last_name": "Mehra"
}
```

### Create Bike Listing
```http
POST /bikes
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "brand": "Honda",
  "model": "CBR 600RR",
  "year": 2020,
  "price": 8500.00,
  "kilometers_driven": 15000,
  "location": "Mumbai, Maharashtra",
  "image_url": "https://example.com/bike-image.jpg"
}
```

### Search Bikes
```http
GET /bikes?search=honda&brand=honda&model=cbr
```

## 🗄️ Database Management Scripts

For Windows users, you have these helpful scripts:

```bash
# Start database services
.\start-db.ps1

# Stop database services  
.\stop-db.ps1

# Connect to database
.\connect-db.bat
```

**Note**: These scripts are designed for Windows PowerShell and Command Prompt.

## 🚀 Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

## 📁 Project Structure

```
mini-vutto/
├── backend/
│   ├── config/          # Database configuration
│   │   └── database.js  # PostgreSQL connection pool
│   ├── database/        # SQL schema and migrations
│   │   └── schema.sql   # Main database schema
│   ├── middleware/      # Authentication middleware
│   │   └── auth.js      # JWT verification & role checks
│   ├── models/          # Data models (future use)
│   ├── routes/          # API route handlers
│   │   ├── auth.js      # Authentication & user management
│   │   └── bikes.js     # Bike listing management
│   ├── utils/           # Utility functions
│   │   └── emailService.js # SendGrid email integration
│   ├── server.js        # Main Express server
│   ├── package.json     # Node.js dependencies
│   └── env.config       # Environment configuration
├── postgres-config/     # PostgreSQL configuration files
├── docker-compose.yml   # Docker services configuration
├── connect-db.bat       # Windows database connection script
├── start-db.ps1         # PowerShell script to start database
├── stop-db.ps1          # PowerShell script to stop database
└── README.md            # This file
```

## 🔒 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management
- **Role-Based Access**: User role verification for protected routes

## 📧 Email Service (SendGrid)

The application uses SendGrid for:
- **OTP Verification**: Email verification during registration
- **Transactional Emails**: User notifications and confirmations

### SendGrid Setup
1. Create a SendGrid account
2. Generate an API key
3. Verify your sender email address
4. Add credentials to `env.config`

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify environment variables in `env.config`
- Test connection with: `node test-new-connection.js`

### Port Already in Use
- Change the PORT in `env.config` if 5000 is busy
- Or stop other services using the same port

### SendGrid Issues
- Verify your SendGrid API key is correct
- Ensure your sender email is verified in SendGrid
- Check SendGrid dashboard for delivery status

### JWT Token Issues
- Verify JWT_SECRET is set in `env.config`
- Check token expiration time
- Ensure token is sent in Authorization header

## 🚀 Deployment Considerations

### Production Environment
- Change JWT_SECRET to a strong, unique value
- Set NODE_ENV to 'production'
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper logging and monitoring

### Database Migration
- Backup existing data before schema changes
- Test migrations in development environment
- Use proper migration tools for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check the troubleshooting section above

---

## 🎯 Implementation Approach

### Architecture Design
The application follows a **layered architecture** pattern with clear separation of concerns:

1. **Routes Layer**: Handles HTTP requests and responses
2. **Middleware Layer**: Authentication, authorization, and validation
3. **Service Layer**: Business logic and external service integration
4. **Data Layer**: Database operations and data persistence

### Security Implementation
- **Multi-layered security** with JWT tokens, password hashing, and input validation
- **Role-based access control** ensuring users can only access appropriate resources
- **Environment-based configuration** keeping sensitive data secure

### Database Design
- **Normalized schema** with proper foreign key relationships
- **Indexed fields** for optimal query performance
- **Cascade operations** maintaining data integrity

### API Design
- **RESTful principles** with consistent endpoint naming
- **Comprehensive error handling** with meaningful error messages
- **Input validation** at multiple levels for data integrity

