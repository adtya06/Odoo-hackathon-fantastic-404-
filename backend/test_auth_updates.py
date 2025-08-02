#!/usr/bin/env python3
"""
Test script for updated authentication with username and optional email
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_user_creation():
    """Test user creation with username and optional email"""
    try:
        from auth import create_user
        from db import db
        
        print("🧪 Testing user creation...")
        
        # Test 1: User with username and email
        try:
            user1 = await create_user(
                username="testuser1",
                password="password123",
                email="test@example.com"
            )
            print("✅ User with email created successfully")
            
            # Clean up
            await db.users.delete_one({"username": "testuser1"})
        except Exception as e:
            print(f"❌ User with email creation failed: {e}")
            return False
        
        # Test 2: User with only username (no email)
        try:
            user2 = await create_user(
                username="testuser2",
                password="password123",
                email=None
            )
            print("✅ User without email created successfully")
            
            # Clean up
            await db.users.delete_one({"username": "testuser2"})
        except Exception as e:
            print(f"❌ User without email creation failed: {e}")
            return False
        
        # Test 3: User with empty email string
        try:
            user3 = await create_user(
                username="testuser3",
                password="password123",
                email=""
            )
            print("✅ User with empty email created successfully")
            
            # Clean up
            await db.users.delete_one({"username": "testuser3"})
        except Exception as e:
            print(f"❌ User with empty email creation failed: {e}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ User creation test failed: {e}")
        return False

async def test_schemas():
    """Test updated schemas"""
    try:
        from schemas import UserSignup, UserResponse
        
        print("🧪 Testing schemas...")
        
        # Test UserSignup with email
        signup1 = UserSignup(
            username="testuser",
            password="password123",
            email="test@example.com"
        )
        print("✅ UserSignup with email works")
        
        # Test UserSignup without email
        signup2 = UserSignup(
            username="testuser",
            password="password123"
        )
        print("✅ UserSignup without email works")
        
        return True
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

async def main():
    print("🧪 Updated Authentication System Test")
    print("=" * 50)
    
    tests = [
        ("Schema Validation", test_schemas, True),
        ("User Creation", test_user_creation, True),
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
        print("🎉 All tests passed! Updated authentication is ready.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return all_passed

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
