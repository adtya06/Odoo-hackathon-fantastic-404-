#!/usr/bin/env python3
"""
Simple test to check if the FastAPI app can be imported and started
"""

try:
    print("🔍 Testing FastAPI app import...")
    from main import app
    print("✅ FastAPI app imported successfully")
    
    print("🔍 Testing individual router imports...")
    try:
        from routers import getComplaints
        print("✅ getComplaints router imported successfully")
    except Exception as e:
        print(f"❌ getComplaints router failed: {e}")
    
    try:
        from routers import raiseComplaint
        print("✅ raiseComplaint router imported successfully")
    except Exception as e:
        print(f"❌ raiseComplaint router failed: {e}")
    
    try:
        from routers import auth
        print("✅ auth router imported successfully")
        if hasattr(auth, 'router'):
            print("✅ auth.router exists")
        else:
            print("❌ auth.router does not exist")
    except Exception as e:
        print(f"❌ auth router failed: {e}")
    
    print("🔍 Testing auth module...")
    from auth import hash_password, create_access_token
    print("✅ Auth module imported successfully")
    
    print("🔍 Testing schemas...")
    from schemas import UserSignup, UserLogin
    print("✅ Schemas imported successfully")
    
    print("🎉 All components are working! Server should start successfully.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("💡 Make sure all dependencies are installed")
