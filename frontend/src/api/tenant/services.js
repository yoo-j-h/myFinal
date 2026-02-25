import api from '../axios';

export const tenantService = {
  getTenants: (keyword) => {
    return api.get('/api/super-admin/tenants', {
      params: keyword ? { keyword } : {}
    });
  },

  getTenantDetail: (id) => {
    return api.get(`/api/super-admin/tenants/${id}`);
  },

  updateTenantStatus: (id, status) => {
    return api.put(`/api/super-admin/tenants/${id}/status`, { status });
  }
};

