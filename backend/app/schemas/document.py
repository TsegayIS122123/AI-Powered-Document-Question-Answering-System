# backend/app/schemas/document.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    title: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentDetailResponse(DocumentResponse):
    content: Optional[str] = None