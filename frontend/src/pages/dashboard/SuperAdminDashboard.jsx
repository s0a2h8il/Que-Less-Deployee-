import React from "react";
import { useSuperAdminDashboard } from "../../hooks/useSuperAdminDashboard";
import SuperAdminSidebar from "../../components/dashboard/superadmin/SuperAdminSidebar";
import SuperAdminStats from "../../components/dashboard/superadmin/SuperAdminStats";
import UsersTable from "../../components/dashboard/superadmin/UsersTable";
import BusinessesTable from "../../components/dashboard/superadmin/BusinessesTable";
import QueuesTable from "../../components/dashboard/superadmin/QueuesTable";
import { Loader } from "../../components";
import { Toast } from "../../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

const SuperAdminDashboard = () => {
  const {
    stats,
    users,
    businesses,
    queues,
    loading,
    error,
    activeTab,
    setActiveTab,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleVerifyBusiness,
    handleUnverifyBusiness,
    handleDeleteBusiness,
    handleDeleteQueue,
    toast,
    hideToast,
  } = useSuperAdminDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Overview</h1>
              <p className="text-slate-500 mt-2">
                Platform-wide statistics and insights
              </p>
            </div>
            <SuperAdminStats stats={stats} loading={loading} />
          </div>
        );

      case "users":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Users Management
              </h1>
              <p className="text-slate-500 mt-2">
                View and manage all platform users
              </p>
            </div>
            <UsersTable
              users={users}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
            />
          </div>
        );

      case "businesses":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Business Verification
              </h1>
              <p className="text-slate-500 mt-2">
                Verify and manage all platform businesses
              </p>
            </div>
            <BusinessesTable
              businesses={businesses}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onVerify={handleVerifyBusiness}
              onUnverify={handleUnverifyBusiness}
              onDelete={handleDeleteBusiness}
            />
          </div>
        );

      case "queues":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Queue Monitoring
              </h1>
              <p className="text-slate-500 mt-2">
                Monitor and manage all active queues
              </p>
            </div>
            <QueuesTable
              queues={queues}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onDelete={handleDeleteQueue}
            />
          </div>
        );

      case "logs":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Activity Logs
              </h1>
              <p className="text-slate-500 mt-2">
                Audit trail of all platform activities
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <p className="text-slate-600">Activity logs coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex justify-between items-center">
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => setActiveTab(activeTab)}
                  className="text-sm font-semibold text-red-700 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Content with Loading State */}
            {loading &&
            (!stats ||
              (!users.length && !businesses.length && !queues.length)) ? (
              <div className="flex h-96 items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default SuperAdminDashboard;
