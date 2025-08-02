#!/usr/bin/env python3

try:
    import auth_new
    print("✅ Auth_new imported successfully")
    print("Functions available:", [attr for attr in dir(auth_new) if not attr.startswith('_')])
except Exception as e:
    print(f"❌ Auth_new import error: {e}")
    import traceback
    traceback.print_exc()
