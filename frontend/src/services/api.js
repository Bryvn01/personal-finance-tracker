import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getAnalytics: (month, year) => api.get(`/transactions/analytics/category?month=${month}&year=${year}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data)
};

// Budgets API
export const budgetsAPI = {
  getAll: (month, year) => api.get(`/budgets?month=${month}&year=${year}`),
  create: (data) => api.post('/budgets', data),
  getAlerts: () => api.get('/budgets/alerts')
};

export default api;