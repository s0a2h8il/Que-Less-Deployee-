import axios from "axios";
import { CONFIG } from "../constants/config";
import { getToken, removeToken } from "../utils/token";
import { handleApiError } from "./errorHandler";

const baseURL = CONFIG.API_URL || "http://localhost:5000/api";
const isLocalApi =
  baseURL.includes("localhost") || baseURL.includes("127.0.0.1");

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: isLocalApi ? 15000 : 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = handleApiError(error);

    if (normalized.status === 401) {
      removeToken();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(normalized);
  },
);

export default api;
