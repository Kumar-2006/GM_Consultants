@echo off
echo GM Consultants - Full-Stack Web Application
echo ============================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Checking if MongoDB is running...
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB might not be installed or not in PATH
    echo Please ensure MongoDB is running on localhost:27017
    echo.
)

echo.
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Setting up database with sample data...
call node setup-db.js

if %errorlevel% neq 0 (
    echo ERROR: Failed to setup database
    pause
    exit /b 1
)

echo.
echo Starting the server...
echo.
echo ============================================
echo Server will be available at:
echo   Website: http://localhost:3000
echo   Admin:   http://localhost:3000/login
echo.
echo Default admin credentials:
echo   Username: Chandramohan
echo   Password: 5655
echo ============================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
