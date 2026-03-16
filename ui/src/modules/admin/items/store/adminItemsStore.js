import { create } from 'zustand';
import { adminItemsApi } from '../api/adminItemsApi';

export const useAdminItemsStore = create((set, get) => ({
  items: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  },
  filters: {
    page: 1,
    per_page: 15,
    search: '',
    status: '',
    vendor_id: '',
    category_id: '',
  },
  loading: false,
  saving: false,
  error: '',

  async fetchItems(params = {}, options = {}) {
    const nextFilters = {
      ...get().filters,
      ...params,
    };
    const { silent = false } = options;

    if (!silent) {
      set({ loading: true, error: '' });
    } else {
      set({ error: '' });
    }

    try {
      const response = await adminItemsApi.index(nextFilters);
      const body = response.data;

      set({
        items: body.data || [],
        filters: nextFilters,
        pagination: {
          current_page: body.current_page,
          last_page: body.last_page,
          per_page: body.per_page,
          total: body.total,
          from: body.from || 0,
          to: body.to || 0,
        },
        loading: silent ? get().loading : false,
      });
    } catch (error) {
      set({ loading: silent ? get().loading : false, error: error.message });
    }
  },

  async updateItemStatus(id, data) {
    set({ saving: true, error: '' });

    try {
      const response = await adminItemsApi.updateStatus(id, data);
      const updatedItem = response.data.data;

      // Update the item in the list
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
        saving: false,
      }));
    } catch (error) {
      set({ saving: false, error: error.message });
      throw error;
    }
  },

  clearMessages() {
    set({ error: '' });
  },
}));
