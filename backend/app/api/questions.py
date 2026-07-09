# backend/app/api/questions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..models.document import Document
from ..models.question import Question
from ..schemas.question import QuestionCreate, QuestionResponse, AnswerResponse
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.post("/", response_model=AnswerResponse)
async def ask_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db)
):
    """Ask a question about a document"""
    # Check if document exists
    document = db.query(Document).filter(Document.id == question_data.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not document.content:
        raise HTTPException(status_code=400, detail="Document content not available")
    
    try:
        # Get AI response
        ai_service = AIService()
        response = await ai_service.ask_question(
            question=question_data.question,
            context=document.content
        )
        
        # Save question and answer
        question = Question(
            document_id=document.id,
            question_text=question_data.question,
            answer_text=response["answer"],
            confidence_score=response.get("confidence_score"),
            model_used=response.get("model_used"),
            tokens_used=response.get("tokens_used"),
            processing_time=response.get("processing_time")
        )
        db.add(question)
        db.commit()
        db.refresh(question)
        
        return {
            "answer": response["answer"],
            "question_id": question.id,
            "confidence_score": response.get("confidence_score"),
            "model_used": response.get("model_used")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@router.get("/document/{document_id}", response_model=List[QuestionResponse])
def get_question_history(
    document_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get question history for a document"""
    questions = db.query(Question).filter(
        Question.document_id == document_id
    ).order_by(Question.created_at.desc()).offset(skip).limit(limit).all()
    
    return questions