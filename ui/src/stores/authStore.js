import { create } from 'zustand';
import { authApi } from '../shared/lib/authApi';

export const roleRouteMap = {
  Admin: '/admin',
  Manager: '/manager',
  User: '/user',
  GeneralManager: '/general-manager',
  System: '/system',
  Vendor: '/vendor',
};

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: '',
  async initializeAuth() {
    if (get().initialized) {
      return;
    }

    set({ loading: true, error: '' });

    try {
      const response = await authApi.me();
      const user = response.data.data;

      set({
        user,
        role: user.role,
        isAuthenticated: true,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
        error: error.status === 401 ? '' : error.message,
      });
    }
  },
  async login(credentials) {
    set({ loading: true, error: '' });

    try {
      await authApi.csrfCookie();
      const response = await authApi.login(credentials);
      let user = response?.data?.data ?? null;

      if (!user) {
        const meResponse = await authApi.me();
        user = meResponse?.data?.data ?? null;
      }

      if (!user || !user.role) {
        throw new Error('Authenticated user payload is missing role information.');
      }

      set({
        user,
        role: user.role,
        isAuthenticated: true,
        loading: false,
        initialized: true,
      });

      return user;
    } catch (error) {
      set({
        loading: false,
        error: error.message || 'Login failed.',
      });
      throw error;
    }
  },
  async logout() {
    set({ loading: true, error: '' });

    try {
      await authApi.logout();
    } finally {
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
        error: '',
      });
    }
  },
  clearError() {
    set({ error: '' });
  },
}));

export const authStore = useAuthStore;
