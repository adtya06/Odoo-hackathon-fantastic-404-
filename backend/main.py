from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import getComplaints, raiseComplaint, auth

app = FastAPI(
    title="Civic Issue Reporting API",
    description="API for reporting and managing civic issues",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router)  # Authentication routes
app.include_router(getComplaints.router)
app.include_router(raiseComplaint.router)

@app.get("/")
async def root():
    return {"message": "Civic Issues API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running properly"}
