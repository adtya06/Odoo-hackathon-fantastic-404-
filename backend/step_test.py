#!/usr/bin/env python3
"""
Simple import test to isolate the issue
"""

print("🔍 Testing step by step...")

try:
    print("1. Testing schemas import...")
    import schemas
    print("✅ schemas imported")
except Exception as e:
    print(f"❌ schemas failed: {e}")
    exit(1)

try:
    print("2. Testing db import...")
    import db
    print("✅ db imported")
except Exception as e:
    print(f"❌ db failed: {e}")
    exit(1)

try:
    print("3. Testing auth module import...")
    import auth
    print("✅ auth module imported")
except Exception as e:
    print(f"❌ auth module failed: {e}")
    exit(1)

try:
    print("4. Testing auth router import...")
    from routers import auth as auth_router
    print("✅ auth router module imported")
    
    if hasattr(auth_router, 'router'):
        print("✅ auth_router.router exists")
    else:
        print("❌ auth_router.router missing")
        print(f"Available attributes: {dir(auth_router)}")
        exit(1)
except Exception as e:
    print(f"❌ auth router failed: {e}")
    exit(1)

try:
    print("5. Testing other routers...")
    from routers import getComplaints, raiseComplaint
    print("✅ other routers imported")
except Exception as e:
    print(f"❌ other routers failed: {e}")
    exit(1)

try:
    print("6. Testing main app...")
    from main import app
    print("✅ main app imported")
except Exception as e:
    print(f"❌ main app failed: {e}")
    exit(1)

print("🎉 All imports successful!")
