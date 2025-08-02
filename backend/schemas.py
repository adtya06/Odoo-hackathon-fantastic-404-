from pydantic import BaseModel 




class UserCreate(BaseModel):
    uername: str
    password: str
    email: str
    location : str

class raiseComplaint(BaseModel):
    user_id : str =  "Anonymous"
    upvote: list[int]
    location : str
    photo:list[str]
    category: str
    description: str
    flag : bool = True

# Helper to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc