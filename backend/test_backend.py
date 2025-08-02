#!/usr/bin/env python3
"""
Test script to verify all backend components are working
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_database():
    """Test database connection"""
    try:
        from db import test_db_connection
        print("🔍 Testing database connection...")
        result = await test_db_connection()
        return result
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

async def test_auth_functions():
    """Test authentication functions"""
    try:
        from auth import hash_password, verify_password, create_access_token
        print("🔍 Testing authentication functions...")
        
        # Test password hashing
        password = "testpassword123"
        hashed = hash_password(password)
        if verify_password(password, hashed):
            print("✅ Password hashing works")
        else:
            print("❌ Password hashing failed")
            return False
        
        # Test token creation
        token = create_access_token(data={"sub": "testuser"})
        if token:
            print("✅ Token creation works")
        else:
            print("❌ Token creation failed")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Auth test failed: {e}")
        return False

def test_imports():
    """Test all required imports"""
    try:
        print("🔍 Testing imports...")
        import fastapi
        print("✅ FastAPI")
        import uvicorn
        print("✅ Uvicorn")
        import motor
        print("✅ Motor")
        import pydantic
        print("✅ Pydantic")
        import bcrypt
        print("✅ Bcrypt")
        import jwt
        print("✅ PyJWT")
        import jose
        print("✅ Python-JOSE")
        import dotenv
        print("✅ Python-dotenv")
        return True
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        return False

async def test_app():
    """Test FastAPI app initialization"""
    try:
        print("🔍 Testing FastAPI app...")
        from main import app
        print("✅ FastAPI app loads successfully")
        return True
    except Exception as e:
        print(f"❌ App test failed: {e}")
        return False

async def main():
    print("🧪 Backend Authentication System Test")
    print("=" * 50)
    
    tests = [
        ("Imports", test_imports, False),
        ("Database", test_database, True),
        ("Authentication", test_auth_functions, True),
        ("FastAPI App", test_app, True),
    ]
    
    results = []
    
    for test_name, test_func, is_async in tests:
        try:
            if is_async:
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
        print()
    
    print("📊 Test Results:")
    print("-" * 30)
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not passed:
            all_passed = False
    
    print("-" * 30)
    if all_passed:
        print("🎉 All tests passed! Backend is ready to run.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return all_passed

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
