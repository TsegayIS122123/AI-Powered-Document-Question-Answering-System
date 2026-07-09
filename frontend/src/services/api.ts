// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document Services - Add trailing slashes!
export const documentService = {
  upload: (formData: FormData) =>
    api.post('/api/documents/', formData, {  // ← Added /
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/api/documents/'),  // ← Added /
  getById: (id: number) => api.get(`/api/documents/${id}/`),  // ← Added /
  delete: (id: number) => api.delete(`/api/documents/${id}/`),  // ← Added /
};

// Question Services - Add trailing slashes!
export const questionService = {
  ask: (documentId: number, question: string) =>
    api.post('/api/questions/', { document_id: documentId, question }),  // ← Added /
  getHistory: (documentId: number) =>
    api.get(`/api/documents/${documentId}/questions/`),  // ← Added /
};