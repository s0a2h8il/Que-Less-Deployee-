// Normalizes axios / fetch errors into a compact shape
export const getErrorMessage = (error) => {
  if (!error) return { message: "Unknown error", status: 500 };

  // Axios style
  if (error.response) {
    const { status, data } = error.response;
    // Validation errors (array)
    if (data?.errors) {
      return {
        message: data.message || "Validation Failed",
        status,
        validation: data.errors,
        data,
      };
    }
    // Standard message
    return {
      message: data?.message || data?.error || "Request failed",
      status,
      data,
    };
  }

  // No response (network)
  if (error.request) {
    return { message: "Network error or server is offline", status: 0 };
  }

  // Timeout or other
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return { message: "Request timed out", status: 0 };
  }

  // Fallback
  return { message: error.message || String(error), status: 500 };
};

export const handleApiError = (error, { toast } = {}) => {
  const normalized = getErrorMessage(error);
  if (toast && typeof toast === "function") {
    // show friendly message
    toast({ type: "error", title: "Error", message: normalized.message });
  }
  return normalized;
};

export default { getErrorMessage, handleApiError };
