
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict

from analyzer import analyze_performance

app = FastAPI(
    title="LearnAdapt AI Service",
    description="AI-powered personalized learning analysis",
    version="1.0.0"
)


class ConceptScore(BaseModel):
    correct: int
    total: int


class StudentPerformance(BaseModel):
    concept_scores: Dict[str, ConceptScore]


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


@app.post("/analyze")
def analyze_student(data: StudentPerformance):
    try:
        scores = {
            concept: score.model_dump()
            for concept, score in data.concept_scores.items()
        }

        result = analyze_performance(scores)

        return {
            "success": True,
            "message": "Student performance analyzed successfully",
            "data": result
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
