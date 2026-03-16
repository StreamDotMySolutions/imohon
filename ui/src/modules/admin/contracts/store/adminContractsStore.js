import { create } from 'zustand';
import { adminContractsApi } from '../api/adminContractsApi';
import { adminVendorsApi } from '../../vendors/api/adminVendorsApi';

export const useAdminContractsStore = create((set, get) => ({
  contracts: [],
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
    active: '',
    vendor_id: '',
    category_id: '',
  },
  selectedContract: null,
  vendors: [],
  loading: false,
  saving: false,
  error: '',
  validationErrors: {},
  async fetchContracts(params = {}, options = {}) {
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
      const response = await adminContractsApi.index(nextFilters);
      const body = response.data;

      set({
        contracts: body.data || [],
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
  async fetchContract(contractId) {
    set({ loading: true, error: '', selectedContract: null });

    try {
      const response = await adminContractsApi.show(contractId);

      set({
        selectedContract: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
  async createContract(payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminContractsApi.store(payload);
      set({ saving: false });
      await get().fetchContracts(get().filters, { silent: true });
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
  async updateContract(contractId, payload) {
    set({ saving: true, error: '', validationErrors: {} });

    try {
      const response = await adminContractsApi.update(contractId, payload);
      set({
        saving: false,
        selectedContract: response.data.data,
      });
      await get().fetchContracts(get().filters, { silent: true });
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
  async deleteContract(contractId) {
    set({ loading: true, error: '' });

    try {
      await adminContractsApi.destroy(contractId);
      set({ loading: false });
      await get().fetchContracts(get().filters);
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  async fetchVendors() {
    try {
      const response = await adminVendorsApi.index();
      set({ vendors: response.data.data || [] });
    } catch (error) {
      set({ error: error.message });
    }
  },
  async toggleActive(contractId, active) {
    set({ saving: true, error: '' });
    try {
      const response = await adminContractsApi.toggleStatus(contractId, active);
      set({ saving: false, selectedContract: response.data.data });
      await get().fetchContracts(get().filters, { silent: true });
      return response.data.data;
    } catch (error) {
      set({ saving: false, error: error.message });
      throw error;
    }
  },
  clearMessages() {
    set({ error: '', validationErrors: {} });
  },
}));
