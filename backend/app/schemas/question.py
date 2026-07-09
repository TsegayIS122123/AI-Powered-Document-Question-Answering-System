# backend/app/schemas/question.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class QuestionCreate(BaseModel):
    document_id: int
    question: str

class QuestionResponse(BaseModel):
    id: int
    document_id: int
    question_text: str
    answer_text: Optional[str] = None
    confidence_score: Optional[float] = None
    model_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnswerResponse(BaseModel):
    answer: str
    question_id: Optional[int] = None
    confidence_score: Optional[float] = None
    model_used: Optional[str] = None