# backend/app/services/ai_service.py
import time
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from ..core.config import settings

class AIService:
    def __init__(self):
        # Initialize OpenAI client
        if settings.OPENAI_API_KEY:
            self.client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY,
                timeout=60.0,  # 60 second timeout
                max_retries=3   # Auto-retry on errors
            )
        else:
            self.client = None
    
    async def ask_question(self, question: str, context: str) -> Dict[str, Any]:
        """
        Ask a question using the AI model
        """
        start_time = time.time()
        
        try:
            if self.client and settings.OPENAI_API_KEY:
                # Use real OpenAI API (modern version)
                response = await self._call_openai(question, context)
            else:
                # Use mock response (for testing without API key)
                response = await self._mock_ai_response(question, context)
            
            processing_time = time.time() - start_time
            
            return {
                "answer": response["answer"],
                "confidence_score": response.get("confidence_score", 0.85),
                "model_used": response.get("model", "gpt-3.5-turbo"),
                "tokens_used": response.get("tokens_used", 150),
                "processing_time": processing_time
            }
            
        except Exception as e:
            raise Exception(f"AI service error: {str(e)}")
    
    async def _call_openai(self, question: str, context: str) -> Dict[str, Any]:
        """Call OpenAI API using modern 2.x syntax"""
        try:
            prompt = f"""Context: {context}

Question: {question}

Please answer the question based on the context provided. If the answer cannot be found in the context, say so.

Answer:"""
            
            # ✅ Modern OpenAI 2.x syntax
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a helpful assistant that answers questions based on the provided context."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return {
                "answer": response.choices[0].message.content,
                "model": response.model,
                "tokens_used": response.usage.total_tokens
            }
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    async def _mock_ai_response(self, question: str, context: str) -> Dict[str, Any]:
        """Mock AI response for testing (no API key needed)"""
        # Simple keyword matching for demo
        mock_responses = {
            "what": "Based on the document, I found information about the topic.",
            "how": "The document describes the process in detail.",
            "why": "According to the context, this is because of several factors.",
            "when": "The timeline is mentioned in the document.",
            "who": "The document references key stakeholders.",
            "summarize": "The document provides a comprehensive overview of the subject matter.",
            "main": "The main topic of this document is clearly explained in the content."
        }
        
        # Find response based on question keywords
        answer = "I found relevant information in the document. "
        for key, response in mock_responses.items():
            if key.lower() in question.lower():
                answer = response
                break
        
        answer += " The document provides comprehensive information on this subject."
        
        return {
            "answer": answer,
            "model": "mock-gpt-3.5-turbo",
            "confidence_score": 0.75,
            "tokens_used": 100
        }