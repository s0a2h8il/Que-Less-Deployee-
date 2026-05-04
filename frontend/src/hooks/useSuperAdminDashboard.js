import { useState, useEffect, useCallback } from "react";
import { superAdminApi } from "../api/superAdminApi";

/**
 * Custom hook for Super Admin Dashboard
 */
export const useSuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Filters state
  const [filters, setFilters] = useState({
    users: { search: "", role: "", page: 1, limit: 10 },
    businesses: {
      search: "",
      isVerified: "",
      isActive: "",
      page: 1,
      limit: 10,
    },
    queues: { search: "", status: "", page: 1, limit: 10 },
  });

  const [pagination, setPagination] = useState({
    users: { currentPage: 1, totalPages: 1 },
    businesses: { currentPage: 1, totalPages: 1 },
    queues: { currentPage: 1, totalPages: 1 },
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Fetch platform stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await superAdminApi.getPlatformStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showToast("Failed to load platform stats", "error");
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await superAdminApi.getAllUsers(filters.users);
      setUsers(response.data.users);
      setPagination((prev) => ({
        ...prev,
        users: response.data.pagination,
      }));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
      showToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [filters.users]);

  // Fetch businesses
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await superAdminApi.getAllBusinesses(filters.businesses);
      setBusinesses(response.data.businesses);
      setPagination((prev) => ({
        ...prev,
        businesses: response.data.pagination,
      }));
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      setError("Failed to load businesses");
      showToast(
        err.response?.data?.message || "Failed to load businesses",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [filters.businesses]);

  // Fetch queues
  const fetchQueues = useCallback(async () => {
    try {
      setLoading(true);
      const response = await superAdminApi.getAllQueues(filters.queues);
      setQueues(response.data.queues);
      setPagination((prev) => ({
        ...prev,
        queues: response.data.pagination,
      }));
    } catch (err) {
      console.error("Failed to fetch queues:", err);
      setError("Failed to load queues");
      showToast(
        err.response?.data?.message || "Failed to load queues",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [filters.queues]);

  // Initial data fetch
  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "businesses") {
      fetchBusinesses();
    } else if (activeTab === "queues") {
      fetchQueues();
    }
  }, [activeTab, fetchStats, fetchUsers, fetchBusinesses, fetchQueues]);

  // Handle verify business
  const handleVerifyBusiness = async (businessId) => {
    try {
      await superAdminApi.verifyBusiness(businessId);
      showToast("Business verified successfully", "success");
      fetchBusinesses();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to verify business",
        "error",
      );
    }
  };

  // Handle unverify business
  const handleUnverifyBusiness = async (businessId) => {
    try {
      await superAdminApi.unverifyBusiness(businessId);
      showToast("Business unverified successfully", "success");
      fetchBusinesses();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to unverify business",
        "error",
      );
    }
  };

  // Handle delete business
  const handleDeleteBusiness = async (businessId, permanent = false) => {
    try {
      await superAdminApi.deleteBusiness(businessId, permanent);
      showToast(
        permanent ? "Business permanently deleted" : "Business deactivated",
        "success",
      );
      fetchBusinesses();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete business",
        "error",
      );
    }
  };

  // Handle delete queue
  const handleDeleteQueue = async (queueId, permanent = false) => {
    try {
      await superAdminApi.deleteQueue(queueId, permanent);
      showToast(
        permanent ? "Queue permanently deleted" : "Queue closed",
        "success",
      );
      fetchQueues();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete queue",
        "error",
      );
    }
  };

  // Handle filter changes
  const handleFilterChange = (tab, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [key]: value, page: 1 },
    }));
  };

  // Handle page change
  const handlePageChange = (tab, page) => {
    setFilters((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], page },
    }));
  };

  // Refetch all data
  const refetch = useCallback(() => {
    fetchStats();
    fetchUsers();
    fetchBusinesses();
    fetchQueues();
  }, [fetchStats, fetchUsers, fetchBusinesses, fetchQueues]);

  return {
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
    refetch,
    toast,
    hideToast,
    showToast,
  };
};
