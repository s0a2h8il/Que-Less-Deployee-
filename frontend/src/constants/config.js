export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL,
  BASE_URL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  APP_NAME: "Queue-Less",
  VERSION: "1.0.0",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EXPLORE: "/explore",
};
