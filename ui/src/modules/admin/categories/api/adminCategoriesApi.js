import { http } from '../../../../shared/lib/http';

export const adminCategoriesApi = {
  index(params = {}) {
    return http.get('/admin/categories', { params });
  },
  store(payload) {
    return http.post('/admin/categories', payload);
  },
  show(categoryId) {
    return http.get(`/admin/categories/${categoryId}`);
  },
  update(categoryId, payload) {
    return http.put(`/admin/categories/${categoryId}`, payload);
  },
  destroy(categoryId) {
    return http.delete(`/admin/categories/${categoryId}`);
  },
  order(categoryId, direction) {
    return http.patch(`/admin/categories/${categoryId}/order`, { direction });
  },
};
