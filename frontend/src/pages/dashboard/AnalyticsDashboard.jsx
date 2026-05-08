import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import useAnalytics from "../../hooks/useAnalytics.js";
import AnalyticsFilterBar from "../../components/analytics/AnalyticsFilterBar.jsx";
import AnalyticsStats from "../../components/analytics/AnalyticsStats.jsx";
import QueueStatusChart from "../../components/analytics/QueueStatusChart.jsx";
import WaitTimeChart from "../../components/analytics/WaitTimeChart.jsx";
import PeakHoursChart from "../../components/analytics/PeakHoursChart.jsx";
import CompletionRateChart from "../../components/analytics/CompletionRateChart.jsx";
import BusinessPerformanceTable from "../../components/analytics/BusinessPerformanceTable.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Link } from "react-router-dom";
import { AlertCircle, RotateCw, Zap } from "lucide-react";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const {
    overview,
    waitTimeData,
    peakHoursData,
    completionData,
    queueStats,
    loading,
    error,
    filters,
    handleFilterChange,
    setDateRange,
    refetch,
  } = useAnalytics();

  // Authorization check
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Only admins can view analytics</p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Brand Logo Link */}
        <Link to="/" className="flex items-center gap-3 group mb-10 w-fit">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
              boxShadow: "0 8px 16px rgba(224,122,95,0.2)",
            }}
          >
            <Zap size={18} fill="white" className="text-white" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">
              Queue<span className="text-[#E07A5F]">-Less</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Virtual Queue
            </span>
          </div>
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Track queue performance and user metrics
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            disabled={loading}
            className="self-start p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all shadow-lg shadow-indigo-200 sm:self-auto flex items-center justify-center gap-2"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              <RotateCw size={20} />
            </motion.div>
            {loading && <span className="text-sm font-bold pr-1">Refreshing...</span>}
          </motion.button>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <div>
                <p className="text-red-500 font-medium">{error}</p>
                <button
                  onClick={refetch}
                  className="text-red-400 underline text-sm mt-1"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Bar */}
        <AnalyticsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onDateRangeChange={setDateRange}
        />

        {/* Stats Cards */}
        <AnalyticsStats overview={overview} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Queue Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 backdrop-blur"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Queue Status Distribution
            </h2>
            <QueueStatusChart data={overview?.queueStats} />
          </motion.div>

          {/* Peak Hours Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 backdrop-blur"
          >
            <h2 className="text-xl font-bold text-white mb-4">Peak Hours</h2>
            <PeakHoursChart data={peakHoursData} />
          </motion.div>

          {/* Wait Time Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 backdrop-blur lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Average Waiting Time by Queue
            </h2>
            <WaitTimeChart data={waitTimeData} />
          </motion.div>

          {/* Completion Rate Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 backdrop-blur lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Completion Rate
            </h2>
            <CompletionRateChart data={completionData} />
          </motion.div>
        </div>

        {/* Business Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur overflow-hidden"
        >
          <BusinessPerformanceTable queueStats={queueStats} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
