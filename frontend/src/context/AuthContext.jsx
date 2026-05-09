import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";
import { setToken, getToken, removeToken } from "../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const applySession = (userData, newToken) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    authApi.getMe()
      .then((res) => {
        if (res.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setTokenState(storedToken);
        }
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  // ── Auth actions ─────────────────────────────────────────────────────────
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success) {
        applySession(res.data.user, res.data.token);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success) {
        applySession(res.data.user, res.data.token);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const authValue = React.useMemo(() => ({ 
    user, 
    token, 
    setUser, 
    loading, 
    isAuthenticated, 
    login, 
    register, 
    logout 
  }), [user, token, loading, isAuthenticated, login, register, logout]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
