#!/usr/bin/env python3

try:
    from schemas import TokenData
    print("✅ Schemas imported successfully")
except Exception as e:
    print(f"❌ Schemas import error: {e}")
    import traceback
    traceback.print_exc()
