import { backendServerUrl, http } from './http';

export const authApi = {
  csrfCookie() {
    return fetch(`${backendServerUrl}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });
  },
  login(payload) {
    return http.post('/login', payload);
  },
  me() {
    return http.get('/me');
  },
  logout() {
    return http.post('/logout');
  },
};
