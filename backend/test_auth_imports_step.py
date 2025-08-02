#!/usr/bin/env python3

# Test each import in auth.py one by one
imports_to_test = [
    ("datetime", "from datetime import datetime, timedelta"),
    ("typing", "from typing import Optional"),
    ("bcrypt", "import bcrypt"),
    ("jwt", "import jwt"),
    ("os", "import os"),
    ("dotenv", "from dotenv import load_dotenv"),
    ("fastapi", "from fastapi import HTTPException, Depends, status"),
    ("fastapi.security", "from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials"),
    ("db", "from db import db"),
    ("schemas", "from schemas import TokenData"),
]

for name, import_stmt in imports_to_test:
    try:
        exec(import_stmt)
        print(f"✅ {name} imported successfully")
    except Exception as e:
        print(f"❌ {name} import error: {e}")
        import traceback
        traceback.print_exc()
        print()
