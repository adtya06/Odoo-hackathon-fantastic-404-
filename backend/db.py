from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"  # default local Mongo
client = AsyncIOMotorClient(MONGO_URL)

db = client["fundb"]  # choose DB name

