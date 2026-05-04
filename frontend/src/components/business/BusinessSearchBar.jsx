import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "..";

const BusinessSearchBar = ({ onSearch, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);
  const debounceTimer = useRef(null);

  // Synchronize internal state with parent if necessary
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Live search with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      onSearch({ search: value });
    }, 300); // Wait 300ms after user stops typing

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative w-full max-w-2xl mx-auto -mt-8 z-10 px-4"
    >
      <div
        className="flex items-center gap-3 p-3 rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <Search size={20} style={{ color: "var(--text-muted)" }} />
        <div className="flex-1">
          <Input
            placeholder="Search clinics, salons, restaurants..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-none focus-visible:ring-0 shadow-none h-10"
            style={{
              background: "transparent",
              color: "var(--text-primary)",
            }}
            fullWidth
          />
        </div>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              color: "var(--text-muted)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(129, 178, 154, 0.1)";
              e.currentTarget.style.color = "#81B29A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </form>
  );
};

export default BusinessSearchBar;
