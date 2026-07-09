# backend/app/services/document_processor.py
import os
import re
from typing import Optional

async def process_document(file_path: str) -> Optional[str]:
    """
    Process document and extract text content
    Supports: .txt, .pdf, .docx
    """
    try:
        file_extension = file_path.split(".")[-1].lower()
        content = ""
        
        if file_extension == "txt":
            # Read text file
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                
        elif file_extension == "pdf":
            # Use PyPDF2 (you'll need to install: pip install PyPDF2)
            try:
                import PyPDF2
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        content += page.extract_text() + "\n"
            except ImportError:
                content = "PDF processing not available. Please install PyPDF2."
                
        elif file_extension in ["docx", "doc"]:
            # Use python-docx (you'll need to install: pip install python-docx)
            try:
                import docx
                doc = docx.Document(file_path)
                content = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            except ImportError:
                content = "DOCX processing not available. Please install python-docx."
        
        # Clean content
        content = re.sub(r'\s+', ' ', content).strip()
        
        return content
        
    except Exception as e:
        raise Exception(f"Document processing failed: {str(e)}")