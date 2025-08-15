@echo off
echo 🔌 Connecting to PostgreSQL Database...
echo.

REM Add PostgreSQL to PATH
set PATH=%PATH%;C:\Program Files\PostgreSQL\17\bin

echo ✅ PostgreSQL 17.5 is ready!
echo.
echo 📊 Database Connection Details:
echo    Host: localhost
echo    Port: 5432
echo    Database: mini_vutto
echo    Username: mini_vutto
echo    Password: minivutto
echo.
echo 🚀 Connecting to database...
echo.

REM Connect to database
psql -U mini_vutto -h localhost -d mini_vutto

pause

