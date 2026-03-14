import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const backendServerUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:8000';

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error?.response?.data;

    return Promise.reject({
      status: error?.response?.status ?? 500,
      message: payload?.message ?? 'Request failed.',
      errors: payload?.errors ?? {},
    });
  }
);
