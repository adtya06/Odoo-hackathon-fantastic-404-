from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import getComplaints , raiseComplaint

app = FastAPI(
    title="Civic Issue Reporting API",
    description="API for reporting and managing civic issues",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(getComplaints.router)
app.include_router(raiseComplaint.router)
