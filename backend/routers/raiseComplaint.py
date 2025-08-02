from fastapi import APIRouter, HTTPException
import schemas
from logics import getComplaints, raiseComplaints
from typing import List


router = APIRouter(
    prefix="/api",
    tags=["Raise Complaints"]
)

@router.post("/complaints", response_model=dict)
async def create_complaint(complaint: schemas.raiseComplaint):
    try:
        result = await raiseComplaints.raiseComplaint(complaint)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
