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
      const data = await analyticsApi.getOverviewAnalytics(params);
      setOverview(data);
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
      const data = await analyticsApi.getBusinessAnalytics(
        filters.businessId,
        params,
      );
      setBusinessAnalytics(data);
    } catch (err) {
      console.error("Business analytics error:", err);
    }
  }, [filters.businessId, getQueryParams]);

  // Fetch queue analytics
  const fetchQueueAnalytics = useCallback(async () => {
    try {
      const params = getQueryParams();
      const data = await analyticsApi.getQueueAnalytics(params);
      setQueueStats(data);

      // Prepare data for wait time chart
      if (data && data.length > 0) {
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
      const data = await analyticsApi.getPeakHours(params);
      setPeakHoursData(data.peakHoursData || []);
    } catch (err) {
      console.error("Peak hours error:", err);
    }
  }, [getQueryParams]);

  // Fetch completion rate
  const fetchCompletionRate = useCallback(async () => {
    try {
      const params = getQueryParams();
      const data = await analyticsApi.getCompletionRate(params);
      setCompletionData(data.completionData || []);
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

      const [overviewRes, queueRes, peakRes, completionRes] =
        await Promise.allSettled([
          analyticsApi.getOverviewAnalytics(params),
          analyticsApi.getQueueAnalytics(params),
          analyticsApi.getPeakHours(params),
          analyticsApi.getCompletionRate(params),
        ]);

      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
      if (queueRes.status === "fulfilled") {
        setQueueStats(queueRes.value);
        const chartData = queueRes.value.map((queue) => ({
          name: queue.title.substring(0, 10),
          waitTime: queue.avgWaitingTime,
        }));
        setWaitTimeData(chartData);
      }
      if (peakRes.status === "fulfilled")
        setPeakHoursData(peakRes.value.peakHoursData || []);
      if (completionRes.status === "fulfilled")
        setCompletionData(completionRes.value.completionData || []);
    } catch (err) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [getQueryParams]);

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
