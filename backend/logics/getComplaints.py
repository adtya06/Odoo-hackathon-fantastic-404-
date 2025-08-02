import schemas
import db
from typing import List

async def getcomplaints() -> List[dict]:
    """Retrieve all complaints from the database"""
    complaints = []
    cursor = db.db["complaints"].find({})
    async for document in cursor:
        complaints.append(schemas.serialize_doc(document))
    return complaints
