import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method?.toLowerCase() !== 'get') {
    try {
      const { data } = await axios.get('/api/csrf-token');
      config.headers['csrf-token'] = data.csrfToken;
    } catch (error) {
      console.error('Could not get CSRF token', error);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;