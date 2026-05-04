/**
 * Utility Functions for Formatting Data
 * Reusable formatters for dates, numbers, time, and text across the app
 */

// ============================================================================
// DATE FORMATTERS
// ============================================================================

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'full', 'time', 'datetime'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options = {
    short: { month: "short", day: "numeric", year: "2-digit" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
    datetime: {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  };

  return new Intl.DateTimeFormat(
    "en-US",
    options[format] || options.short,
  ).format(dateObj);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now - dateObj;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

/**
 * Format time duration (milliseconds to readable string)
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time
 */
export const formatDuration = (ms) => {
  if (!ms || ms < 0) return "0s";

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.slice(0, 2).join(" ") || "0s";
};

/**
 * Get time of day greeting
 * @returns {string} Greeting
 */
export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// ============================================================================
// NUMBER FORMATTERS
// ============================================================================

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (!amount && amount !== 0) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format number with commas and decimals
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (!num && num !== 0) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format large numbers as abbreviated (1.2K, 1.5M, etc.)
 * @param {number} num - Number to format
 * @returns {string} Abbreviated number
 */
export const formatCompactNumber = (num) => {
  if (!num && num !== 0) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(num);
};

/**
 * Format percentage
 * @param {number} num - Number to format as percentage
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (num, decimals = 1) => {
  if (typeof num !== "number") return "";
  return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted bytes
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// ============================================================================
// TEXT FORMATTERS
// ============================================================================

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize all words
 * @param {string} text - Text to capitalize
 * @returns {string} Title case text
 */
export const titleCase = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Truncate text to specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix when truncated (default: "...")
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Remove HTML tags from text
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format email (truncate if too long)
 * @param {string} email - Email address
 * @param {number} maxLength - Maximum length (default: 30)
 * @returns {string} Formatted email
 */
export const formatEmail = (email, maxLength = 30) => {
  if (!email) return "";
  return truncateText(email, maxLength);
};

// ============================================================================
// STATUS & BADGE FORMATTERS
// ============================================================================

/**
 * Get status badge color
 * @param {string} status - Status value
 * @returns {string} Variant name for Badge component
 */
export const getStatusVariant = (status) => {
  const variants = {
    active: "success",
    inactive: "default",
    paused: "warning",
    closed: "danger",
    pending: "info",
    approved: "success",
    rejected: "danger",
    completed: "success",
    waiting: "info",
    left: "warning",
    skipped: "default",
    verified: "success",
    unverified: "warning",
    online: "success",
    offline: "default",
  };
  return variants[status?.toLowerCase()] || "default";
};

/**
 * Format status text
 * @param {string} status - Status value
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return "";
  return titleCase(status.replace(/_/g, " "));
};

// ============================================================================
// COMBINATION FORMATTERS
// ============================================================================

/**
 * Format member display name and info
 * @param {Object} member - Member object {firstName, lastName, email}
 * @returns {string} Formatted name
 */
export const formatMemberName = (member) => {
  if (!member) return "";
  if (member.firstName && member.lastName) {
    return `${member.firstName} ${member.lastName}`;
  }
  if (member.email) return member.email.split("@")[0];
  return "Unknown";
};

/**
 * Format queue position with badge (e.g., "#5")
 * @param {number} position - Position in queue
 * @returns {string} Formatted position
 */
export const formatQueuePosition = (position) => {
  if (!position || position < 1) return "-";
  return `#${position}`;
};

/**
 * Format wait time in minutes
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted wait time
 */
export const formatWaitTime = (ms) => {
  if (!ms || ms < 0) return "0 min";
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
};

/**
 * Format address
 * @param {Object} address - Address object {street, city, state, zip}
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return "";
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
  ].filter(Boolean);
  return parts.join(", ");
};

/**
 * Format percentage with label
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {string} Formatted percentage
 */
export const formatProgressPercentage = (current, total) => {
  if (!total || total === 0) return "0%";
  return `${Math.round((current / total) * 100)}%`;
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Pluralized word
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Format list of items for display (join with commas and "and")
 * @param {string[]} items - Items to format
 * @param {string} connector - Connector word (default: "and")
 * @returns {string} Formatted list
 */
export const formatList = (items, connector = "and") => {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${connector} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${connector} ${items[items.length - 1]}`;
};
