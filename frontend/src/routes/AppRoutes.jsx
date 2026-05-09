import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { lazyLoad } from "../utils/lazyLoad";
import SuspenseLoader from "../components/common/SuspenseLoader";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";

// Lazy loaded pages
const Home = lazyLoad(() => import("../pages/Home"));
const Login = lazyLoad(() => import("../pages/auth/Login"));
const Register = lazyLoad(() => import("../pages/auth/Register"));
const VerifyOTP = lazyLoad(() => import("../pages/auth/VerifyOTP"));
const ExploreQueues = lazyLoad(() => import("../pages/ExploreQueues"));
const QueueDetail = lazyLoad(() => import("../pages/QueueDetail"));
const UserDashboard = lazyLoad(
  () => import("../pages/dashboard/UserDashboard"),
);
const AdminDashboard = lazyLoad(
  () => import("../pages/dashboard/AdminDashboard"),
);
const AnalyticsDashboard = lazyLoad(
  () => import("../pages/dashboard/AnalyticsDashboard"),
);
const SuperAdminDashboard = lazyLoad(
  () => import("../pages/dashboard/SuperAdminDashboard"),
);
const Business = lazyLoad(() => import("../pages/Business"));
const HowItWorksPage = lazyLoad(() => import("../pages/HowItWorksPage"));
const About = lazyLoad(() => import("../pages/About"));
const Careers = lazyLoad(() => import("../pages/Careers"));
const Contact = lazyLoad(() => import("../pages/Contact"));
const Privacy = lazyLoad(() => import("../pages/Privacy"));
const ExchangeRequests = lazyLoad(() => import("../pages/ExchangeRequests"));
const Notifications = lazyLoad(() => import("../pages/Notifications"));
const NotFound = lazyLoad(() => import("../pages/NotFound"));

const Unauthorized = () => (
  <div className="p-20 text-center text-red-500">
    <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
  </div>
);

// Layout wrapper: RouteErrorBoundary + Suspense wrap MainLayout
// This is the correct pattern in React Router v6 — non-Route components
// must live inside the `element` prop, not as direct children of <Route>.
const LayoutWithBoundary = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<SuspenseLoader />}>
      <MainLayout />
    </Suspense>
  </RouteErrorBoundary>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutWithBoundary />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/explore" element={<ExploreQueues />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/queue/:id" element={<QueueDetail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/business"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <Business />
            </ProtectedRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exchanges"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <ExchangeRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Protected Routes */}
        <Route
          path="/admin/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
