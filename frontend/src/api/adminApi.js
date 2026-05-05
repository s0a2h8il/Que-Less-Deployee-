import api from "./axios";

// Admin API — business owner operations
export const adminApi = {
  // Business
  createBusiness: (data) => api.post("/business", data).then(r => r.data),
  getMyBusinesses: () => api.get("/business/my").then(r => r.data),

  // Queue management
  createQueue: (data) => api.post("/queues", data).then(r => r.data),
  getMyQueues: () => api.get("/queues").then(r => r.data),
  getQueueDetails: (id) => api.get(`/queues/${id}`).then(r => r.data),
  callNext: (id) => api.post(`/queues/${id}/next`).then(r => r.data),
  pauseQueue: (id) => api.put(`/queues/${id}/pause`).then(r => r.data),
  resumeQueue: (id) => api.put(`/queues/${id}/resume`).then(r => r.data),
  closeQueue: (id) => api.put(`/queues/${id}/close`).then(r => r.data),
  startQueue: (id) => api.put(`/queues/${id}/start`).then(r => r.data),
};
