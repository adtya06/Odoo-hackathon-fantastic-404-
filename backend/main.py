from fastapi import FastAPI
from pydantic import BaseModel
from bson import ObjectId
from typing import List
from db import db

app = FastAPI()
