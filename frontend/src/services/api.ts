// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Document Services
export const documentService = {
  upload: (formData: FormData) => 
    api.post('/api/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/api/documents'),
  getById: (id: number) => api.get(`/api/documents/${id}`),
  delete: (id: number) => api.delete(`/api/documents/${id}`),
};

// Question Services
export const questionService = {
  ask: (documentId: number, question: string) =>
    api.post('/api/questions', { document_id: documentId, question }),
  getHistory: (documentId: number) =>
    api.get(`/api/documents/${documentId}/questions`),
};