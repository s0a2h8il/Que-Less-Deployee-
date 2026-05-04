import React, { createContext, useCallback, useState, useEffect } from "react";
import Toasts from "../components/ui/Toast";

export const ToastContext = createContext({
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
});

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = idCounter++;
      setToasts((s) => [...s, { id, type, title, message }]);
      if (duration > 0) {
        setTimeout(
          () => setToasts((s) => s.filter((t) => t.id !== id)),
          duration,
        );
      }
      return id;
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  // optional: avoid console.logs in production
  useEffect(() => {
    if (import.meta.env.PROD) {
      // replace console.log in production if desired
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <Toasts />
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);

export default ToastProvider;
