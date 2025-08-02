#!/usr/bin/env python3
"""
Test auth router step by step
"""

print("🔍 Testing auth router dependencies...")

try:
    print("1. Testing fastapi import...")
    from fastapi import APIRouter, HTTPException, Depends, status
    print("✅ FastAPI components imported")
except Exception as e:
    print(f"❌ FastAPI failed: {e}")
    exit(1)

try:
    print("2. Testing datetime import...")
    from datetime import timedelta
    print("✅ datetime imported")
except Exception as e:
    print(f"❌ datetime failed: {e}")
    exit(1)

try:
    print("3. Testing schemas import...")
    from schemas import UserSignup, UserLogin, Token, UserResponse
    print("✅ schemas imported")
except Exception as e:
    print(f"❌ schemas failed: {e}")
    print("Available in schemas:", dir(__import__('schemas')))
    exit(1)

try:
    print("4. Testing auth module import...")
    from auth import (
        create_user, 
        authenticate_user, 
        create_access_token, 
        get_current_user,
        ACCESS_TOKEN_EXPIRE_MINUTES
    )
    print("✅ auth functions imported")
except Exception as e:
    print(f"❌ auth functions failed: {e}")
    print("Available in auth:", dir(__import__('auth')))
    exit(1)

try:
    print("5. Testing router creation...")
    router = APIRouter(prefix="/auth", tags=["Authentication"])
    print("✅ router created successfully")
except Exception as e:
    print(f"❌ router creation failed: {e}")
    exit(1)

print("🎉 Auth router dependencies are working!")
