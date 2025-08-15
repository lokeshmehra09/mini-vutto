# Mini Vutto Backend

A Node.js/Express backend for the Mini Vutto used bike listings platform.

## Features

- User authentication (JWT-based)
- CRUD operations for bike listings
- Search and filter functionality
- PostgreSQL database integration
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Adminer (for database management)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Create a PostgreSQL database named `mini_vutto`
   - Run the SQL commands from `database/schema.sql` in Adminer
   - Update `.env` file with your database credentials

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `DB_PASSWORD`: Your PostgreSQL password
     - `JWT_SECRET`: A secure random string for JWT signing

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Bikes
- `GET /bikes` - List all bikes (with optional search)
- `GET /bikes/:id` - Get bike details
- `POST /bikes` - Add new bike (authenticated)
- `PUT /bikes/:id` - Update bike (authenticated, owner only)
- `DELETE /bikes/:id` - Delete bike (authenticated, owner only)
- `GET /bikes/my/listings` - Get user's own listings

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `created_at` (TIMESTAMP)

### Bikes Table
- `id` (SERIAL PRIMARY KEY)
- `brand` (VARCHAR)
- `model` (VARCHAR)
- `year` (INTEGER)
- `price` (DECIMAL)
- `kilometers_driven` (INTEGER)
- `location` (VARCHAR)
- `image_url` (TEXT)
- `seller_id` (INTEGER, FOREIGN KEY)
- `created_at` (TIMESTAMP)

## Testing the API

You can test the API endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend application

## Sample Data

Use `database/seed.sql` to populate your database with sample bike listings for testing.

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error



