#!/usr/bin/env python3

try:
    print("Testing routers.auth import...")
    import routers.auth
    print("✅ Routers.auth module imported")
    print("Attributes:", [attr for attr in dir(routers.auth) if not attr.startswith('_')])
except Exception as e:
    print(f"❌ Routers.auth import error: {e}")
    import traceback
    traceback.print_exc()
