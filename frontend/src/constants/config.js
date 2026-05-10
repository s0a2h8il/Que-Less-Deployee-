const API_URL = import.meta.env.VITE_API_URL;

if (typeof window !== "undefined" && import.meta.env.PROD && !API_URL) {
  console.error(
    "[QueueLess] VITE_API_URL was not set at build time. API calls fall back to localhost and will fail in the browser for a deployed site. In Render → Frontend service → Environment, set VITE_API_URL to https://YOUR-BACKEND.onrender.com/api and trigger a new build.",
  );
}

export const CONFIG = {
  API_URL,
  BASE_URL: API_URL ? API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000",
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
