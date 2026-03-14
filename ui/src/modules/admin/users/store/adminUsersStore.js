import { create } from 'zustand';
import { adminUsersApi } from '../api/adminUsersApi';

export const useAdminUsersStore = create((set, get) => ({
  users: [],
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
  selectedUser: null,
  loading: false,
  saving: false,
  error: '',
  validationErrors: {},
  async fetchUsers(params = {}) {
    const nextFilters = {
      ...get().filters,
      ...params,
    };

    set({ loading: true, error: '' });

    try {
      const response = await adminUsersApi.index(nextFilters);
      const body = response.data;

      set({
        users: body.data || [],
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
  async fetchUser(userId) {
    set({ loading: true, error: '', selectedUser: null });

    try {
      const response = await adminUsersApi.show(userId);

      set({
        selectedUser: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
  async createUser(payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminUsersApi.store(payload);
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
  async updateUser(userId, payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminUsersApi.update(userId, payload);
      set({
        saving: false,
        selectedUser: response.data.data,
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
  async deleteUser(userId) {
    set({ loading: true, error: '' });

    try {
      await adminUsersApi.destroy(userId);
      set({ loading: false });
      await get().fetchUsers(get().filters);
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  clearMessages() {
    set({ error: '', validationErrors: {} });
  },
}));
