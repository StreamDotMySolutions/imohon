import { http } from '../../../../shared/lib/http';

export const adminVendorsApi = {
  index(params = {}) {
    return http.get('/admin/vendors', { params });
  },
};
