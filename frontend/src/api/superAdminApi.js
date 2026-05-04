import api from "./axios";

// Super Admin API — platform management operations
export const superAdminApi = {
  getPlatformStats:  ()                       => api.get("/admin/stats")                                                  .then(r => r.data),
  getAllUsers:        (params = {})            => api.get("/admin/users",      { params })                                 .then(r => r.data),
  getAllBusinesses:   (params = {})            => api.get("/admin/businesses", { params })                                 .then(r => r.data),
  verifyBusiness:    (id)                     => api.put(`/admin/businesses/${id}/verify`)                                .then(r => r.data),
  unverifyBusiness:  (id)                     => api.put(`/admin/businesses/${id}/unverify`)                              .then(r => r.data),
  deleteBusiness:    (id, permanent = false)  => api.delete(`/admin/businesses/${id}`, { data: { permanent } })           .then(r => r.data),
  getAllQueues:       (params = {})            => api.get("/admin/queues",     { params })                                 .then(r => r.data),
  deleteQueue:       (id, permanent = false)  => api.delete(`/admin/queues/${id}`,      { data: { permanent } })          .then(r => r.data),
  getActivityLogs:   (params = {})            => api.get("/admin/logs",       { params })                                 .then(r => r.data),
};
