#!/usr/bin/env python3
"""
Test auth.py imports step by step
"""

print("🔍 Testing auth.py dependencies...")

try:
    print("1. Testing datetime import...")
    from datetime import datetime, timedelta
    print("✅ datetime imported")
except Exception as e:
    print(f"❌ datetime failed: {e}")
    exit(1)

try:
    print("2. Testing typing import...")
    from typing import Optional
    print("✅ typing imported")
except Exception as e:
    print(f"❌ typing failed: {e}")
    exit(1)

try:
    print("3. Testing bcrypt import...")
    import bcrypt
    print("✅ bcrypt imported")
except Exception as e:
    print(f"❌ bcrypt failed: {e}")
    exit(1)

try:
    print("4. Testing jwt import...")
    import jwt
    print("✅ jwt imported")
except Exception as e:
    print(f"❌ jwt failed: {e}")
    exit(1)

try:
    print("5. Testing os import...")
    import os
    print("✅ os imported")
except Exception as e:
    print(f"❌ os failed: {e}")
    exit(1)

try:
    print("6. Testing dotenv import...")
    from dotenv import load_dotenv
    print("✅ dotenv imported")
except Exception as e:
    print(f"❌ dotenv failed: {e}")
    exit(1)

try:
    print("7. Testing fastapi imports...")
    from fastapi import HTTPException, Depends, status
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    print("✅ fastapi imported")
except Exception as e:
    print(f"❌ fastapi failed: {e}")
    exit(1)

try:
    print("8. Testing db import...")
    from db import db
    print("✅ db imported")
except Exception as e:
    print(f"❌ db failed: {e}")
    exit(1)

try:
    print("9. Testing schemas import...")
    from schemas import TokenData
    print("✅ schemas.TokenData imported")
except Exception as e:
    print(f"❌ schemas.TokenData failed: {e}")
    print("Available in schemas:", dir(__import__('schemas')))
    exit(1)

print("🎉 All auth.py dependencies work individually!")
