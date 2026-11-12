
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Literal

from analyzer import analyze_performance, analyze_practice_gaps

app = FastAPI(
    title="LearnAdapt AI Service",
    description="AI-powered personalized learning analysis",
    version="1.0.0"
)


# Existing diagnostic quiz models
class ConceptScore(BaseModel):
    correct: int
    total: int


class StudentPerformance(BaseModel):
    concept_scores: Dict[str, ConceptScore]


# Smart Gap Detector models
class PracticeAnswer(BaseModel):
    questionIndex: int = Field(ge=0)
    selectedAnswer: int = Field(ge=0)
    correct: bool
    timeTakenSeconds: float = Field(ge=0)
    difficulty: Literal["easy", "medium", "hard"]
    gapType: Literal["conceptual", "logical", "application"]
    skill: str = Field(min_length=1)


class PracticeResult(BaseModel):
    concept: str
    answers: List[PracticeAnswer]


class PracticePerformance(BaseModel):
    practice_results: List[PracticeResult]


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


# Existing diagnostic analysis endpoint
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
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# New Smart Gap Detector endpoint
@app.post("/analyze-practice-gaps")
def analyze_practice_performance(data: PracticePerformance):
    try:
        practice_results = [
            result.model_dump()
            for result in data.practice_results
        ]

        result = analyze_practice_gaps(practice_results)

        return {
            "success": True,
            "message": "Smart Gap Detector analysis completed",
            "data": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
