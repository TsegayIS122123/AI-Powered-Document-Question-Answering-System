# backend/app/api/documents.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime

from ..core.database import get_db
from ..models.document import Document
from ..models.question import Question
from ..schemas.document import DocumentCreate, DocumentResponse, DocumentDetailResponse
from ..services.document_processor import process_document

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get all documents"""
    documents = db.query(Document).offset(skip).limit(limit).all()
    return documents

@router.post("/", response_model=DocumentResponse)
async def create_document(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a new document"""
    try:
        # Save file temporarily
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = f"{upload_dir}/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create document record
        document = Document(
            title=title,
            file_path=file_path,
            file_type=file.filename.split(".")[-1] if "." in file.filename else None,
            file_size=os.path.getsize(file_path),
            status="processing"
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Process document (async)
        try:
            # Extract content and process with AI
            content = await process_document(file_path)
            document.content = content
            document.status = "completed"
            db.commit()
            db.refresh(document)
        except Exception as e:
            document.status = "failed"
            db.commit()
            raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")
        
        return document
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document_id: int, 
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.delete("/{document_id}")
def delete_document(
    document_id: int, 
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file if exists
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}