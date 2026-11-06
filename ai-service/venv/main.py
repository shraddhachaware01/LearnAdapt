
from fastapi import FastAPI

app = FastAPI(
    title="LearnAdapt AI Service",
    description="AI-powered personalized learning analysis",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to LearnAdapt AI Python Service!"
    }

@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "Python AI Service is running!"
    }
