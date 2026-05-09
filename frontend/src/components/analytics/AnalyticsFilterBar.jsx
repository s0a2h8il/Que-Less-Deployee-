import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Building2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { businessApi } from "../../api/businessApi.js";
import { superAdminApi } from "../../api/superAdminApi.js";

const AnalyticsFilterBar = ({ filters, onFilterChange, onDateRangeChange }) => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch businesses for superadmin
  useEffect(() => {
    if (user?.role === "superadmin") {
      const fetchBusinesses = async () => {
        try {
          const data = await superAdminApi.getAllBusinesses();
          setBusinesses(data.businesses || []);
        } catch (err) {
          console.error("Failed to fetch businesses:", err);
        }
      };
      fetchBusinesses();
    }
  }, [user?.role]);

  // Preset date ranges
  const dateRanges = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 90 Days", value: "90days" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 backdrop-blur space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Date Range
          </label>
          <div className="flex flex-wrap gap-2">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onDateRangeChange(range.value)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                  filters.dateRange === range.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 whitespace-nowrap">
            <Calendar size={16} />
            Start Date
          </label>
          <input
            type="date"
            value={
              filters.startDate
                ? filters.startDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              onFilterChange(
                "startDate",
                e.target.value ? new Date(e.target.value) : null,
              )
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 whitespace-nowrap">
            <Calendar size={16} />
            End Date
          </label>
          <input
            type="date"
            value={
              filters.endDate ? filters.endDate.toISOString().split("T")[0] : ""
            }
            onChange={(e) =>
              onFilterChange(
                "endDate",
                e.target.value ? new Date(e.target.value) : null,
              )
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Business Filter (for superadmin) */}
      {user?.role === "superadmin" && businesses.length > 0 && (
        <div className="pt-2 border-t border-slate-700/50">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2 whitespace-nowrap">
            <Building2 size={16} />
            Filter by Business
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange("businessId", null)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
                !filters.businessId
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All Businesses
            </button>
            {businesses.map((business) => (
              <button
                key={business._id}
                onClick={() => onFilterChange("businessId", business._id)}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition whitespace-nowrap ${
                  filters.businessId === business._id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {business.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.businessId || filters.startDate || filters.endDate) && (
        <div className="pt-2 border-t border-slate-700/50 flex flex-wrap gap-2">
          {filters.businessId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300"
            >
              <span>Business filter active</span>
              <button
                onClick={() => onFilterChange("businessId", null)}
                className="hover:text-blue-200"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
          {(filters.startDate || filters.endDate) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300"
            >
              <span>
                {filters.startDate && filters.endDate
                  ? `${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`
                  : "Custom date range"}
              </span>
              <button
                onClick={() => {
                  onFilterChange("startDate", null);
                  onFilterChange("endDate", null);
                }}
                className="hover:text-purple-200"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsFilterBar;
