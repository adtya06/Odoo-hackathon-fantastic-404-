#!/usr/bin/env python3

try:
    from db import db
    print("✅ DB imported successfully")
except Exception as e:
    print(f"❌ DB import error: {e}")
    import traceback
    traceback.print_exc()
