from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Authentication Schemas
class UserSignup(BaseModel):
    username: str
    password: str
    email: Optional[str] = None  # Made email optional

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None  # Made email optional
    created_at: datetime

# Existing Schemas
class UserCreate(BaseModel):
    username: str  # Fixed typo: was "uername"
    password: str
    email: str
    location: str

class raiseComplaint(BaseModel):
    user_id: str = "Anonymous"
    photo: list[str]
    category: str
    location: str
    description: str

class complaintStored(BaseModel):
    user_id: str = "Anonymous"
    upvote: list[int]
    location: str
    photo: list[str]
    category: str
    description: str
    flag: int = 1
    status: str = "open"

# Helper to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc