import axios from 'axios';
import { getClerkAccessToken, getClerkSupabaseToken, supabase } from '../lib/supabaseClient';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const searchClient = axios.create({
  baseURL: process.env.REACT_APP_SEARCH_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getClerkAccessToken();
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
  if (!supabase) throw new Error('LearnHub Assistant data access is not configured.');
  const accessToken = await getClerkSupabaseToken();
  if (!accessToken) throw new Error('Sign in to use the LearnHub Assistant.');
  const response = await searchClient.post('/assistant/chat', payload, {
    timeout: 30000,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
