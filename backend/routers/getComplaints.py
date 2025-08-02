from fastapi import APIRouter, HTTPException
from backend.logics import getComplaints


router = APIRouter(
    prefix="/api",
    tags=["Get Complaints"]
)

@router.get("/complaints")
async def list_complaints():
    try:
        complaints = await getComplaints.getcomplaints()
        return {"complaints": complaints}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
