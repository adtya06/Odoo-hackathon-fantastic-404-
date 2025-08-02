from backend import schemas
from backend import db


async def raiseComplaint(complaint: schemas.raiseComplaint):
    # Convert the input complaint to a stored complaint
    stored_complaint = schemas.complaintStored(
        user_id=complaint.user_id,
        upvote=[],  # Initialize empty upvote list
        location=complaint.location,
        photo=complaint.photo,
        category=complaint.category,
        description=complaint.description,
        flag=True,  # Default value
        status="open"  # Default value
    )
    
    # Convert to dict for storage
    complaint_dict = stored_complaint.model_dump()
    
    # Store the complaint in MongoDB
    result = await db.db["complaints"].insert_one(complaint_dict)
    
    # Return the created complaint with the new ID
    created_complaint = await db.db["complaints"].find_one({"_id": result.inserted_id})
    return schemas.serialize_doc(created_complaint)