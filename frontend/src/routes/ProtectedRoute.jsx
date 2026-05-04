import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullPage message="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          toast: {
            type: "error",
            title: "Login required",
            message: "Please sign in to access this page.",
          },
        }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          toast: {
            type: "error",
            title: "Access restricted",
            message:
              "This page is only available after signing in with the right account.",
          },
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
