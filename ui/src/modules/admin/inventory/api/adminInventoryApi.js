import { http } from '../../../../shared/lib/http';

export const adminInventoryApi = {
  index(params = {}) {
    return http.get('/admin/inventories', { params });
  },
  summary() {
    return http.get('/admin/inventories/summary');
  },
};
