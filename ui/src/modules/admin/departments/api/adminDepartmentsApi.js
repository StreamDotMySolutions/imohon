import { http } from '../../../../shared/lib/http';

export const adminDepartmentsApi = {
  index(params = {}) {
    return http.get('/admin/departments', { params });
  },
  store(payload) {
    return http.post('/admin/departments', payload);
  },
  show(departmentId) {
    return http.get(`/admin/departments/${departmentId}`);
  },
  update(departmentId, payload) {
    return http.put(`/admin/departments/${departmentId}`, payload);
  },
  destroy(departmentId) {
    return http.delete(`/admin/departments/${departmentId}`);
  },
};
