import { create } from 'zustand';
import { adminDepartmentsApi } from '../api/adminDepartmentsApi';

export const useAdminDepartmentsStore = create((set, get) => ({
  departments: [],
  allDepartments: [],
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
  },
  selectedDepartment: null,
  loading: false,
  saving: false,
  error: '',
  validationErrors: {},
  async fetchDepartments(params = {}) {
    const nextFilters = {
      ...get().filters,
      ...params,
    };

    set({ loading: true, error: '' });

    try {
      const response = await adminDepartmentsApi.index(nextFilters);
      const body = response.data;

      set({
        departments: body.data || [],
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
  async fetchAllDepartments() {
    try {
      const response = await adminDepartmentsApi.index({ page: 1, per_page: 100 });

      set({
        allDepartments: response.data.data || [],
      });
    } catch (error) {
      set({ error: error.message });
    }
  },
  async fetchDepartment(departmentId) {
    set({ loading: true, error: '', selectedDepartment: null });

    try {
      const response = await adminDepartmentsApi.show(departmentId);

      set({
        selectedDepartment: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
  async createDepartment(payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminDepartmentsApi.store(payload);
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
  async updateDepartment(departmentId, payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminDepartmentsApi.update(departmentId, payload);
      set({
        saving: false,
        selectedDepartment: response.data.data,
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
  async deleteDepartment(departmentId) {
    set({ loading: true, error: '', validationErrors: {} });

    try {
      await adminDepartmentsApi.destroy(departmentId);
      set({ loading: false });
      await get().fetchDepartments(get().filters);
    } catch (error) {
      set({
        loading: false,
        error: error.message,
        validationErrors: error.errors || {},
      });
      throw error;
    }
  },
  clearMessages() {
    set({ error: '', validationErrors: {} });
  },
}));
