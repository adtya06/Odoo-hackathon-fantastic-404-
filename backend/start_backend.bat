@echo off
echo 🚀 Civic Issues API - Complete Backend Setup
echo.

cd /d "c:\Users\pingm\Personal Folder\Development\College Projects\Odoo-hackathon-fantastic-404-\backend"

echo 📁 Working in: %CD%
echo.

REM Try Python 3.10 first
echo 🐍 Testing Python 3.10...
"C:\Users\pingm\AppData\Local\Programs\Python\Python310\python.exe" --version >nul 2>&1
if not errorlevel 1 (
    echo ✅ Found Python 3.10
    set "PYTHON_CMD=C:\Users\pingm\AppData\Local\Programs\Python\Python310\python.exe"
    set "PIP_CMD=C:\Users\pingm\AppData\Local\Programs\Python\Python310\Scripts\pip.exe"
    goto :install_packages
)

REM Fallback to py launcher
echo 🔄 Trying py launcher...
py -3.10 --version >nul 2>&1
if not errorlevel 1 (
    echo ✅ Found Python 3.10 via py launcher
    set "PYTHON_CMD=py -3.10"
    set "PIP_CMD=py -3.10 -m pip"
    goto :install_packages
)

echo ❌ Python 3.10 not found
pause
exit /b 1

:install_packages
echo.
echo 📦 Installing all required packages...
"%PIP_CMD%" install fastapi uvicorn[standard] pydantic motor python-dotenv bcrypt PyJWT python-jose[cryptography] python-multipart

if errorlevel 1 (
    echo ❌ Package installation failed
    pause
    exit /b 1
)

echo.
echo ✅ Packages installed successfully!
echo.
echo 🔍 Testing imports...
"%PYTHON_CMD%" -c "import fastapi, uvicorn, motor, pydantic, bcrypt, jwt, jose, dotenv; print('✅ All packages imported successfully')"

if errorlevel 1 (
    echo ❌ Import test failed
    pause
    exit /b 1
)

echo.
echo 🚀 Starting FastAPI server...
echo 📍 API available at: http://localhost:8000
echo 📖 API docs at: http://localhost:8000/docs
echo 🛑 Press Ctrl+C to stop
echo.

"%PYTHON_CMD%" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

pause
