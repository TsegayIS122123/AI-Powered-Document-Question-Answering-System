# backend/app/models/question.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    model_used = Column(String(50), nullable=True)  # ✅ Keep this name for now
    tokens_used = Column(Integer, nullable=True)
    processing_time = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_cached = Column(Integer, default=0)
    
    # Relationships
    document = relationship("Document", back_populates="questions")