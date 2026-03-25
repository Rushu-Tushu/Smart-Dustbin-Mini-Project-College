import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getWorkers: () => api.get('/auth/workers'),
};

// ── Bins ──────────────────────────────────────────────
export const binsAPI = {
  getAll: (params) => api.get('/bins', { params }),
  create: (data) => api.post('/bins', data),
  update: (id, data) => api.put(`/bins/${id}`, data),
  delete: (id) => api.delete(`/bins/${id}`),
  updateLevel: (data) => api.post('/bins/update-level', data),
};

// ── Worker ────────────────────────────────────────────
export const workerAPI = {
  getTasks: () => api.get('/worker/tasks'),
  markCleaned: (id) => api.put(`/worker/complete/${id}`),
};

export default api;
