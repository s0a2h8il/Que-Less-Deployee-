import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data).then(r => r.data),
  login: (credentials) => api.post("/auth/login", credentials).then(r => r.data),
  getMe: () => api.get("/auth/me").then(r => r.data),
  updateProfile: (data) => api.put("/auth/profile", data).then(r => r.data),
  uploadAvatar: (formData) => api.post("/auth/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data),
  verifyOTP: (data) => api.post("/auth/verify-otp", data).then(r => r.data),
  resendOTP: (data) => api.post("/auth/resend-otp", data).then(r => r.data),
};
