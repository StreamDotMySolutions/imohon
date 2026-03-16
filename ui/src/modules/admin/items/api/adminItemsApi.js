import { http } from '../../../../shared/lib/http';

export const adminItemsApi = {
  index: (params) => http.get('/admin/items', { params }),
  updateStatus: (id, data) => http.patch(`/admin/items/${id}/status`, data),
};
