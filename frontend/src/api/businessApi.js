import api from "./axios";

export const businessApi = {
  getBusinesses:   (filters = {}) => api.get("/business",      { params: filters }).then(r => r.data),
  getBusinessById: (id)           => api.get(`/business/${id}`)                   .then(r => r.data),
};
