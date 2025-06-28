@echo off
echo 🚀 Book Inventory Builder - Installation Script
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install server dependencies
echo 📦 Installing server dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

cd ..

REM Create uploads directory
echo 📁 Creating uploads directory...
if not exist uploads mkdir uploads

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit the .env file with your configuration:
    echo    - MongoDB Atlas connection string
    echo    - Google Gemini API key
    echo    - Other settings as needed
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit the .env file with your configuration
echo 2. Get a Gemini API key from: https://makersuite.google.com/app/apikey
echo 3. Set up MongoDB Atlas: https://www.mongodb.com/atlas
echo 4. Run the application: npm run dev
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 📚 For more information, see the README.md file
pause 