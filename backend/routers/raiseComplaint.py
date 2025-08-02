from fastapi import APIRouter, status,HTTPException
from .. import schemas

router = APIRouter(
    prefix="/raiseComplaint",
)

# def get_deps(): 
#     from .. logics import chat
#     return chat

@router.post('/')
def upload_doc_router(query : schemas.UserCreate):
    if not query:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="Please enter your query")
    
        