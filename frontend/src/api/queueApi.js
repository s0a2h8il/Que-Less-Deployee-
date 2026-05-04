import api from "./axios";

export const queueApi = {
  getQueueById: (id) => api.get(`/queues/${id}`).then(r => r.data),
  joinQueue: (id) => api.post(`/queues/${id}/join`).then(r => r.data),
  leaveQueue: (id) => api.post(`/queues/${id}/leave`).then(r => r.data),
  getMyActive: () => api.get("/queues/my-active").then(r => r.data),
  getAll: (p = {}) => api.get("/queues", { params: p }).then(r => r.data),
};
