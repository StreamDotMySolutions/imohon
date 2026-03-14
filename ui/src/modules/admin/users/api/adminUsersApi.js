import { http } from '../../../../shared/lib/http';

export const adminUsersApi = {
  index(params = {}) {
    return http.get('/admin/users', { params });
  },
  store(payload) {
    return http.post('/admin/users', payload);
  },
  show(userId) {
    return http.get(`/admin/users/${userId}`);
  },
  update(userId, payload) {
    return http.put(`/admin/users/${userId}`, payload);
  },
  destroy(userId) {
    return http.delete(`/admin/users/${userId}`);
  },
};
