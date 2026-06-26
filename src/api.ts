import axios from 'axios';

// Usa o mesmo IP de onde o site foi acessado (necessário para funcionar no celular)
const api = axios.create({
  baseURL: `http://${window.location.hostname}:8010/api/`,
});

// Adicionar interceptor para incluir o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studyapp_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
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
  next_review?: string;
  interval?: number;
  ease_factor?: number;
  repetitions?: number;
}

export interface StudySchedule {
  id: number;
  subject: number;
  day_of_week: number;
}

export interface TodayProgress {
  day_of_week: number;
  total_scheduled: number;
  completed: number;
  progress_percentage: number;
  subjects: {
    subject_id: number;
    subject_name: string;
    subject_color: string;
    due_cards: number;
    is_completed: boolean;
  }[];
}

export interface StudySession {
  id: number;
  subject: number;
  subject_name: string;
  subject_color: string;
  duration_minutes: number;
  created_at: string;
}

export interface StudyStats {
  total_minutes_last_7_days: number;
  subject_stats: {
    subject_name: string;
    subject_color: string;
    minutes: number;
  }[];
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'admin' | 'usuario';
  educationLevel?: string;
}


export const studyApi = {
  getSubjects: () => api.get<Subject[]>('subjects/'),
  createSubject: (data: Partial<Subject>) => api.post<Subject>('subjects/', data),
  getFlashcards: (subjectId?: number) => {
    const url = subjectId ? `flashcards/?subject=${subjectId}` : 'flashcards/';
    return api.get<Flashcard[]>(url);
  },
  getDueFlashcards: (subjectId: number) => api.get<Flashcard[]>(`flashcards/?subject=${subjectId}&due=true`),
  reviewFlashcard: (id: number, score: number) => api.post<Flashcard>(`flashcards/${id}/review/`, { score }),
  createFlashcard: (data: Partial<Flashcard>) => api.post<Flashcard>('flashcards/', data),
  updateFlashcard: (id: number, data: Partial<Flashcard>) => api.patch<Flashcard>(`flashcards/${id}/`, data),
  deleteFlashcard: (id: number) => api.delete(`flashcards/${id}/`),
  deleteSubject: (id: number) => api.delete(`subjects/${id}/`),
  
  getSchedule: () => api.get<StudySchedule[]>('schedule/'),
  createSchedule: (data: { subject: number, day_of_week: number }) => api.post<StudySchedule>('schedule/', data),
  deleteSchedule: (id: number) => api.delete(`schedule/${id}/`),
  getTodayProgress: () => api.get<TodayProgress>('schedule/today/'),

  createSession: (data: { subject: number, duration_minutes: number }) => api.post<StudySession>('sessions/', data),
  getSessionStats: () => api.get<StudyStats>('sessions/stats/'),

  login: (username: string, password: string) => api.post<AuthResponse>('auth/login/', { username, password }),
  register: (username: string, password: string, educationLevel: string) => api.post<AuthResponse>('auth/register/', { username, password, educationLevel }),
};

export default api;
