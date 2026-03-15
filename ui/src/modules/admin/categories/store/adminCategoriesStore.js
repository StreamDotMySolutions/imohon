import { create } from 'zustand';
import { adminCategoriesApi } from '../api/adminCategoriesApi';

export const useAdminCategoriesStore = create((set, get) => ({
  categories: [],
  allCategories: [],
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
    parent_id: '',
  },
  selectedCategory: null,
  loading: false,
  saving: false,
  error: '',
  validationErrors: {},
  async fetchCategories(params = {}) {
    const nextFilters = {
      ...get().filters,
      ...params,
    };

    set({ loading: true, error: '' });

    try {
      const response = await adminCategoriesApi.index(nextFilters);
      const body = response.data;

      set({
        categories: body.data || [],
        filters: nextFilters,
        pagination: {
          current_page: body.current_page,
          last_page: body.last_page,
          per_page: body.per_page,
          total: body.total,
          from: body.from || 0,
          to: body.to || 0,
        },
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
  async fetchAllCategories() {
    try {
      const response = await adminCategoriesApi.index({ page: 1, per_page: 300 });

      set({
        allCategories: response.data.data || [],
      });
    } catch (error) {
      set({ error: error.message });
    }
  },
  async fetchCategory(categoryId) {
    set({ loading: true, error: '', selectedCategory: null });

    try {
      const response = await adminCategoriesApi.show(categoryId);

      set({
        selectedCategory: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
  async createCategory(payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminCategoriesApi.store(payload);
      set({ saving: false });
      return response.data.data;
    } catch (error) {
      set({
        saving: false,
        error: error.message,
        validationErrors: error.errors || {},
      });
      throw error;
    }
  },
  async updateCategory(categoryId, payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminCategoriesApi.update(categoryId, payload);
      set({
        saving: false,
        selectedCategory: response.data.data,
      });
      return response.data.data;
    } catch (error) {
      set({
        saving: false,
        error: error.message,
        validationErrors: error.errors || {},
      });
      throw error;
    }
  },
  async deleteCategory(categoryId) {
    set({ loading: true, error: '' });

    try {
      await adminCategoriesApi.destroy(categoryId);
      set({ loading: false });
      await get().fetchCategories(get().filters);
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  async orderCategory(categoryId, direction) {
    set({ loading: true, error: '' });

    try {
      const response = await adminCategoriesApi.order(categoryId, direction);
      set({ loading: false });
      await get().fetchCategories(get().filters);
      return response.data.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  clearMessages() {
    set({ error: '', validationErrors: {} });
  },
}));
