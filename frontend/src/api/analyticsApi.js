import api from "./axios";

// ─── Helper ───────────────────────────────────────────────────────────────────
// All API methods follow the same shape: call api.METHOD(), return response.data.
// Error handling is centralised in the axios interceptor (axios.js).
// ─────────────────────────────────────────────────────────────────────────────

export const analyticsApi = {
  getOverviewAnalytics: (params = {}) => api.get("/analytics/overview", { params }).then(r => r.data),
  getBusinessAnalytics: (businessId, params = {}) => api.get(`/analytics/business/${businessId}`, { params }).then(r => r.data),
  getQueueAnalytics: (params = {}) => api.get("/analytics/queues", { params }).then(r => r.data),
  getPeakHours: (params = {}) => api.get("/analytics/peak-hours", { params }).then(r => r.data),
  getCompletionRate: (params = {}) => api.get("/analytics/completion-rate", { params }).then(r => r.data),
};

export default analyticsApi;
