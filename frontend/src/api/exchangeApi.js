import api from "./axios";

export const exchangeApi = {
  createRequest: (data) => api.post("/exchanges/request", data).then(r => r.data),
  getMyRequests: () => api.get("/exchanges/my-requests").then(r => r.data),
  getHistory: () => api.get("/exchanges/history").then(r => r.data),
  acceptRequest: (id) => api.put(`/exchanges/${id}/accept`).then(r => r.data),
  rejectRequest: (id) => api.put(`/exchanges/${id}/reject`).then(r => r.data),
};
