import { useState, useEffect, useCallback } from "react";
import { businessApi } from "../api/businessApi";

/**
 * Custom hook to manage business data fetching and filtering
 */
export const useBusinesses = (initialFilters = {}) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    city: "",
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a clean filters object (remove empty values)
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
      );

      const res = await businessApi.getBusinesses(cleanFilters);
      
      if (res.success) {
        setBusinesses(res.data.businesses || []);
        setPagination({
          total: res.data.pagination?.total || 0,
          pages: res.data.pagination?.pages || 1,
          currentPage: res.data.pagination?.page || 1,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch businesses");
      // Fallback for UI design if backend is empty/offline
      if (import.meta.env.DEV && !businesses.length) {
        console.warn("API failed, using mock data for development");
        // setBusinesses(MOCK_DATA); // Add mock data here if needed
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    businesses,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    handlePageChange,
    refetch: fetchBusinesses,
    pagination,
  };
};
