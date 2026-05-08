import { useState, useEffect, useCallback } from "react";
import analyticsApi from "../api/analyticsApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const useAnalytics = () => {
  const { user } = useAuth();

  // State
  const [overview, setOverview] = useState(null);
  const [businessAnalytics, setBusinessAnalytics] = useState(null);
  const [queueStats, setQueueStats] = useState([]);
  const [waitTimeData, setWaitTimeData] = useState(null);
  const [peakHoursData, setPeakHoursData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [businessPerformance, setBusinessPerformance] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    dateRange: "30days",
    startDate: null,
    endDate: null,
    businessId: null,
  });

  // Build query params from filters
  const getQueryParams = useCallback(() => {
    const params = {};
    if (filters.startDate) {
      params.startDate = new Date(filters.startDate)
        .toISOString()
        .split("T")[0];
    }
    if (filters.endDate) {
      params.endDate = new Date(filters.endDate).toISOString().split("T")[0];
    }
    if (filters.businessId) {
      params.businessId = filters.businessId;
    }
    return params;
  }, [filters]);

  // Fetch overview analytics
  const fetchOverviewAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = getQueryParams();
      const res = await analyticsApi.getOverviewAnalytics(params);
      setOverview(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch overview analytics");
      console.error("Overview analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, [getQueryParams]);

  // Fetch business analytics
  const fetchBusinessAnalytics = useCallback(async () => {
    if (!filters.businessId) return;
    try {
      const params = getQueryParams();
      const res = await analyticsApi.getBusinessAnalytics(
        filters.businessId,
        params,
      );
      setBusinessAnalytics(res.data);
    } catch (err) {
      console.error("Business analytics error:", err);
    }
  }, [filters.businessId, getQueryParams]);

  // Fetch queue analytics
  const fetchQueueAnalytics = useCallback(async () => {
    try {
      const params = getQueryParams();
      const res = await analyticsApi.getQueueAnalytics(params);
      const data = res.data || [];
      setQueueStats(data);

      // Prepare data for wait time chart
      if (Array.isArray(data) && data.length > 0) {
        const chartData = data.map((queue) => ({
          name: queue.title.substring(0, 10), // Truncate for chart display
          waitTime: queue.avgWaitingTime,
        }));
        setWaitTimeData(chartData);
      }
    } catch (err) {
      console.error("Queue analytics error:", err);
    }
  }, [getQueryParams]);

  // Fetch peak hours
  const fetchPeakHours = useCallback(async () => {
    try {
      const params = getQueryParams();
      const res = await analyticsApi.getPeakHours(params);
      setPeakHoursData(res.data?.peakHoursData || []);
    } catch (err) {
      console.error("Peak hours error:", err);
    }
  }, [getQueryParams]);

  // Fetch completion rate
  const fetchCompletionRate = useCallback(async () => {
    try {
      const params = getQueryParams();
      const res = await analyticsApi.getCompletionRate(params);
      setCompletionData(res.data?.completionData || []);
    } catch (err) {
      console.error("Completion rate error:", err);
    }
  }, [getQueryParams]);

  // Fetch all analytics
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = getQueryParams();

      const promises = [
        analyticsApi.getOverviewAnalytics(params),
        analyticsApi.getQueueAnalytics(params),
        analyticsApi.getPeakHours(params),
        analyticsApi.getCompletionRate(params),
      ];

      // Add business specific analytics if filtered
      if (filters.businessId) {
        promises.push(analyticsApi.getBusinessAnalytics(filters.businessId, params));
      }

      const results = await Promise.allSettled(promises);

      if (results[0].status === "fulfilled") setOverview(results[0].value.data);
      if (results[1].status === "fulfilled") {
        const data = results[1].value.data || [];
        setQueueStats(data);
        if (Array.isArray(data)) {
          const chartData = data.map((queue) => ({
            name: queue.title.substring(0, 10),
            waitTime: queue.avgWaitingTime,
          }));
          setWaitTimeData(chartData);
        }
      }
      if (results[2].status === "fulfilled")
        setPeakHoursData(results[2].value.data?.peakHoursData || []);
      if (results[3].status === "fulfilled")
        setCompletionData(results[3].value.data?.completionData || []);
      
      // Handle business analytics result if it was requested
      if (filters.businessId && results[4]?.status === "fulfilled") {
        setBusinessAnalytics(results[4].value.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [getQueryParams, filters.businessId]);

  // Initial fetch on component mount and filter changes
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superadmin") {
      refetch();
    }
  }, [filters, user?.role, refetch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
      // Reset pagination when filters change
      page: 1,
    }));
  }, []);

  // Helper: Update date range based on preset
  const setDateRange = useCallback(
    (rangeType) => {
      const today = new Date();
      let startDate,
        endDate = today;

      switch (rangeType) {
        case "today":
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "7days":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case "30days":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          break;
        case "90days":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 90);
          break;
        default:
          return;
      }

      handleFilterChange("startDate", startDate);
      handleFilterChange("endDate", endDate);
      handleFilterChange("dateRange", rangeType);
    },
    [handleFilterChange],
  );

  return {
    // Data
    overview,
    businessAnalytics,
    queueStats,
    waitTimeData,
    peakHoursData,
    completionData,
    businessPerformance,

    // UI State
    loading,
    error,

    // Filters
    filters,
    handleFilterChange,
    setDateRange,

    // Actions
    refetch,
    fetchOverviewAnalytics,
    fetchBusinessAnalytics,
    fetchQueueAnalytics,
    fetchPeakHours,
    fetchCompletionRate,
  };
};

export default useAnalytics;
