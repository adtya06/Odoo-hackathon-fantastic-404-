from pydantic import BaseModel 




class UserCreate(BaseModel):
    uername: str
    password: str
    email: str
    location : str

class raiseComplaint(BaseModel):
    user_id : str =  "Anonymous"
    photo:list[str]
    category: str
    location: str
    description: str
class complaintStored(BaseModel):
    user_id : str =  "Anonymous"
    upvote: list[int]
    location : str
    photo:list[str]
    category: str
    description: str
    flag : int = 1
    status : str = "open"
# Helper to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc