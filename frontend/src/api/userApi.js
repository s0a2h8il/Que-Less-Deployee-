import api from "./axios";

export const userApi = {
  getMyActiveQueues: async () => {
    const response = await api.get("/queues/my-active");
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
