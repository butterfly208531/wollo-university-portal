import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wu_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes('/admin/login');
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('wu_admin_token');
      localStorage.removeItem('wu_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ── Public ────────────────────────────────────────────────────────────────────
export const getPolicies = (params) => api.get('/policies', { params });
export const getPolicy = (id) => api.get(`/policies/${id}`);
export const getCategories = () => api.get('/categories');
export const searchPolicies = (params) => api.get('/search', { params });
export const getSuggestions = (q) => api.get('/search/suggest', { params: { q } });

// ── Auth ──────────────────────────────────────────────────────────────────────
export const adminLogin = (email, password) => api.post('/admin/login', { email, password });
export const adminLogout = () => api.post('/admin/logout');
export const getProfile = () => api.get('/admin/profile');

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAnalytics = () => api.get('/admin/analytics');
export const getAdminPolicies = (params) => api.get('/admin/policies', { params });
export const createPolicy = (data) => api.post('/admin/policies', data);
export const updatePolicy = (id, data) => api.put(`/admin/policies/${id}`, data);
export const deletePolicy = (id) => api.delete(`/admin/policies/${id}`);
export const getPolicyVersions = (id) => api.get(`/admin/policies/${id}/versions`);
export const restorePolicyVersion = (id, versionId) => api.post(`/admin/policies/${id}/restore/${versionId}`);
export const importPolicies = (formData) => api.post('/admin/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAuditLogs = (params) => api.get('/admin/audit-logs', { params });

// ── Super Admin ───────────────────────────────────────────────────────────────
export const getAdmins = () => api.get('/super-admin/admins');
export const createAdmin = (data) => api.post('/super-admin/admins', data);
export const updateAdmin = (id, data) => api.put(`/super-admin/admins/${id}`, data);
export const deleteAdmin = (id) => api.delete(`/super-admin/admins/${id}`);
export const getSettings = () => api.get('/super-admin/settings');
export const updateSettings = (data) => api.put('/super-admin/settings', data);

export default api;
