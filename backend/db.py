from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB Atlas connection string from environment variable
MONGO_URL = os.getenv("MONGODB_URL", "your_atlas_connection_string_here")
client = AsyncIOMotorClient(MONGO_URL)

db = client["fundb"]  # choose DB name

