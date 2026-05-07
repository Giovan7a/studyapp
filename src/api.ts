import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8010/api/',
});

export interface Subject {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface Flashcard {
  id: number;
  subject: number;
  subject_name: string;
  question: string;
  answer: string;
  is_learned: boolean;
  created_at: string;
}

export const studyApi = {
  getSubjects: () => api.get<Subject[]>('subjects/'),
  createSubject: (data: Partial<Subject>) => api.post<Subject>('subjects/', data),
  getFlashcards: (subjectId?: number) => {
    const url = subjectId ? `flashcards/?subject=${subjectId}` : 'flashcards/';
    return api.get<Flashcard[]>(url);
  },
  createFlashcard: (data: Partial<Flashcard>) => api.post<Flashcard>('flashcards/', data),
  updateFlashcard: (id: number, data: Partial<Flashcard>) => api.patch<Flashcard>(`flashcards/${id}/`, data),
  deleteFlashcard: (id: number) => api.delete(`flashcards/${id}/`),
};

export default api;
