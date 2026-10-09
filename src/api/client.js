import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const searchClient = axios.create({
  baseURL: process.env.REACT_APP_SEARCH_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('learnhub-access-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || error),
);

export default apiClient;

export const searchResources = async (query, page = 1, perPage = 20) => {
  const response = await searchClient.get('/search', {
    params: { q: query, page, per_page: perPage },
  });
  return response.data;
};

export const askLearnHubAssistant = async (payload) => {
  const response = await searchClient.post('/assistant/chat', payload, { timeout: 30000 });
  return response.data;
};
