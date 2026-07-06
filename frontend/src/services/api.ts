// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Document Services
// export const documentService = {
//   upload: (formData: FormData) =>
//     api.post('/api/documents', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
//   getAll: () => api.get('/api/documents'),
//   getById: (id: number) => api.get(`/api/documents/${id}`),
//   delete: (id: number) => api.delete(`/api/documents/${id}`),
// };

// // Question Services
// export const questionService = {
//   ask: (documentId: number, question: string) =>
//     api.post('/api/questions', { document_id: documentId, question }),
//   getHistory: (documentId: number) =>
//     api.get(`/api/documents/${documentId}/questions`),
// };


// frontend/src/services/api.ts (Temporary Mock Version)
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔴 TEMPORARY MOCK DATA - Remove when backend is ready
const MOCK_DOCUMENTS = [
  { 
    id: 1, 
    title: "Sample Document 1", 
    file_type: "PDF",
    file_size: 1024,
    created_at: new Date().toISOString()
  },
  { 
    id: 2, 
    title: "Sample Document 2", 
    file_type: "DOCX",
    file_size: 2048,
    created_at: new Date().toISOString()
  },
];

// Document Services with Mock Data
export const documentService = {
  upload: (formData: FormData) => {
    // Mock upload - Simulate success
    return Promise.resolve({ 
      data: { 
        id: Date.now(), 
        title: formData.get('title'),
        status: 'success' 
      } 
    });
  },
  getAll: () => {
    // Return mock data
    return Promise.resolve({ data: MOCK_DOCUMENTS });
  },
  getById: (id: number) => {
    const doc = MOCK_DOCUMENTS.find(d => d.id === id);
    return Promise.resolve({ 
      data: doc || { id, title: "Mock Document", content: "Mock content for testing" } 
    });
  },
  delete: (id: number) => {
    return Promise.resolve({ data: { success: true } });
  },
};

// Question Services with Mock Responses
export const questionService = {
  ask: (documentId: number, question: string) => {
    // Mock AI response
    const mockAnswers = [
      "Based on the document, the answer is: The main topic discusses AI integration.",
      "I found that the document emphasizes the importance of full-stack development.",
      "According to the content, the best approach is to use Docker for containerization.",
    ];
    return Promise.resolve({ 
      data: { 
        answer: mockAnswers[Math.floor(Math.random() * mockAnswers.length)] 
      } 
    });
  },
  getHistory: (documentId: number) => {
    return Promise.resolve({ 
      data: [
        { id: 1, question: "What is the document about?", answer: "It's about AI", timestamp: new Date() }
      ] 
    });
  },
};