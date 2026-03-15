import { http } from '../../../../shared/lib/http';

export const adminContractsApi = {
  index(params = {}) {
    return http.get('/admin/contracts', { params });
  },
  store(payload) {
    return http.post('/admin/contracts', payload);
  },
  show(contractId) {
    return http.get(`/admin/contracts/${contractId}`);
  },
  update(contractId, payload) {
    return http.put(`/admin/contracts/${contractId}`, payload);
  },
  destroy(contractId) {
    return http.delete(`/admin/contracts/${contractId}`);
  },
};
