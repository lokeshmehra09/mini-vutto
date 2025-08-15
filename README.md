# Mini Vutto - Used Bike Listings Platform

A full-stack web application for listing and browsing used bikes, built with Node.js, Express, PostgreSQL, and modern web technologies.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT
- **Bike Listings**: Create, view, and manage bike listings
- **Image Upload**: Support for bike photos
- **Email Notifications**: SendGrid integration for email services
- **Database Management**: PostgreSQL with Adminer for database administration
- **Docker Support**: Easy setup with Docker Compose

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Windows native)
- **Authentication**: JWT, bcryptjs
- **Email Service**: SendGrid
- **File Upload**: Multer
- **Database Admin**: pgAdmin or psql command line
- **Platform**: Windows with PowerShell scripts

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

# Create env.config file
touch env.config
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
- `JWT_SECRET`: Generate a strong random string
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

### Step 4: Access Database Admin (Optional)

You can use any PostgreSQL client to manage your database:

**Option 1: Command Line (psql)**
```bash
psql -U mini_vutto -d mini_vutto
```

**Option 2: pgAdmin (GUI Tool)**
- Download [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/)
- Connect with:
  - **Host**: localhost
  - **Port**: 5432
  - **Username**: mini_vutto
  - **Password**: minivutto
  - **Database**: mini_vutto

**Option 3: Use your existing scripts**
- `connect-db.bat` - Windows batch script
- `start-db.ps1` - PowerShell script to start services
- `stop-db.ps1` - PowerShell script to stop services

### Step 5: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install
```

### Step 6: Run the Application

```bash
# Start the development server
npm run dev

# Or start in production mode
npm start
```

The server will start on `http://localhost:5000`

## 📱 API Endpoints

Once the server is running, you can access:

- **Health Check**: `GET http://localhost:5000/`
- **Authentication**: `http://localhost:5000/auth`
- **Bike Listings**: `http://localhost:5000/bikes`

## 🗄️ Database Schema

The database will be automatically initialized with the schema from `backend/database/schema.sql` when you first run Docker Compose.

## 🔧 Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

## 🐳 Database Management Scripts

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

## 📁 Project Structure

```
mini-vutto/
├── backend/
│   ├── config/          # Database configuration
│   ├── database/        # SQL schema and migrations
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json     # Node.js dependencies
├── postgres-config/     # PostgreSQL configuration
├── docker-compose.yml   # Docker services configuration
├── connect-db.bat       # Windows database connection script
├── start-db.ps1         # PowerShell script to start database
├── stop-db.ps1          # PowerShell script to stop database
└── README.md            # This file
```

## 🔒 Security Notes

- The `env.config` file is excluded from version control for security
- Never commit real API keys or passwords
- JWT secrets should be strong and unique in production
- Database passwords should be changed in production

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure Docker containers are running: `docker ps`
- Check if port 5432 is available
- Verify environment variables in `env.config`

### Port Already in Use
- Change the PORT in `env.config` if 5000 is busy
- Or stop other services using the same port

### SendGrid Issues
- Verify your SendGrid API key is correct
- Ensure your sender email is verified in SendGrid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🚴‍♂️✨**
