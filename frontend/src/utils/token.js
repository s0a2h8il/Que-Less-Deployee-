/**
 * Utility for managing the JWT token in localStorage
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getToken = () => localStorage.getItem("token");

export const removeToken = () => localStorage.removeItem("token");
