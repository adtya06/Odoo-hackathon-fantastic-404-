from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/health")
async def auth_health():
    """Health check for auth router"""
    return {"status": "Auth router is working"}

@router.post("/signup")
async def signup():
    """Placeholder signup endpoint"""
    return {"message": "Signup endpoint"}

@router.post("/login")
async def login():
    """Placeholder login endpoint"""
    return {"message": "Login endpoint"}
