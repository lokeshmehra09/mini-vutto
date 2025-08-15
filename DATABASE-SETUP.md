# 🗄️ PostgreSQL Database Setup Guide

## **Step 1: Access Adminer**

1. **Open your browser** and go to: `http://localhost:8080`
2. **Login with these credentials:**
   - **System**: `PostgreSQL`
   - **Server**: `postgres` (Docker service name)
   - **Username**: `mini_vutto`
   - **Password**: `minivutto`
   - **Database**: `mini_vutto`

## **Step 2: Create Database (if needed)**

If the `mini_vutto` database doesn't exist:
1. **Click "Create database"** in Adminer
2. **Enter database name**: `mini_vutto`
3. **Click "Save"**

## **Step 3: Run Database Schema**

1. **Click on the `mini_vutto` database** in the left sidebar
2. **Click "SQL command"** tab
3. **Copy and paste** the contents of `setup-database.sql`
4. **Click "Execute"**

## **Step 4: Verify Setup**

After running the SQL, you should see:
- ✅ **2 users** created (john@example.com, jane@example.com)
- ✅ **5 bikes** created with real data
- ✅ **Tables created** with proper indexes

## **Step 5: Test Database Connection**

1. **Stop the old server** (if running):
   ```bash
   # Press Ctrl+C in the terminal running server-hybrid.js
   ```

2. **Start the new PostgreSQL server**:
   ```bash
   cd backend
   node server-postgres.js
   ```

3. **You should see**:
   ```
   🚀 PostgreSQL JWT Server running on port 5000
   🗄️ Database: PostgreSQL connected
   ```

## **Step 6: Test the API**

1. **Test public endpoint**:
   ```
   GET http://localhost:5000/bikes
   ```

2. **Test registration**:
   ```
   POST http://localhost:5000/auth/register
   Body: {"email": "test@example.com", "password": "123456"}
   ```

3. **Test login**:
   ```
   POST http://localhost:5000/auth/login
   Body: {"email": "john@example.com", "password": "password"}
   ```

## **🔍 Troubleshooting**

### **Connection Issues**
- **Check Docker**: `docker ps` - both containers should be running
- **Check ports**: Adminer on 8080, PostgreSQL on 5432
- **Check credentials**: Use exact values from docker-compose.yml

### **Database Errors**
- **Tables not found**: Run the schema SQL again
- **Permission denied**: Check user privileges
- **Connection refused**: Wait for PostgreSQL to fully start

### **Server Errors**
- **Module not found**: Run `npm install` in backend folder
- **Database connection failed**: Check env.config file
- **Port already in use**: Kill other processes on port 5000

## **🎯 What You'll Get**

### **Before (Hardcoded)**
- ❌ Data lost on server restart
- ❌ No real persistence
- ❌ Limited scalability
- ❌ Prototype only

### **After (PostgreSQL)**
- ✅ **Data persistence** - survives restarts
- ✅ **Real database** - production ready
- ✅ **Scalability** - handle thousands of bikes
- ✅ **Multiple users** - real user management
- ✅ **Data integrity** - foreign key constraints
- ✅ **Performance** - proper indexing

## **🚀 Next Steps**

1. **Test all endpoints** with Postman
2. **Add more bikes** through the API
3. **Test user management** (register, login, profile)
4. **Deploy to production** when ready

---

**Your Mini Vutto app is now production-ready with a real PostgreSQL database!** 🎉

