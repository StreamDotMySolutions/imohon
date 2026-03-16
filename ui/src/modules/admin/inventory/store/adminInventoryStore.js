import { create } from 'zustand';
import { adminInventoryApi } from '../api/adminInventoryApi';

export const useAdminInventoryStore = create((set, get) => ({
  inventories: [],
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
    vendor_id: '',
    category_id: '',
  },
  summary: {
    total_units: 0,
    by_category: [],
    by_vendor: [],
  },
  loading: false,
  summaryLoading: false,
  error: '',

  async fetchInventories(params = {}, options = {}) {
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
      const response = await adminInventoryApi.index(nextFilters);
      const body = response.data;

      set({
        inventories: body.data || [],
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

  async fetchSummary() {
    set({ summaryLoading: true, error: '' });

    try {
      const response = await adminInventoryApi.summary();
      set({
        summary: response.data.data || {
          total_units: 0,
          by_category: [],
          by_vendor: [],
        },
        summaryLoading: false,
      });
    } catch (error) {
      set({ summaryLoading: false, error: error.message });
    }
  },

  clearMessages() {
    set({ error: '' });
  },
}));
