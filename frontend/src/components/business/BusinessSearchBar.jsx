import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X as XIcon, Sparkles as SparklesIcon } from "lucide-react";

const BusinessSearchBar = ({ onSearch, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef(null);
  const onSearchRef = useRef(onSearch);
  const inputRef = useRef(null);

  // Keep ref up to date
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Synchronize internal state with parent if necessary
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Live search with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearchRef.current({ search: value });
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div
        className="relative flex items-center gap-3 transition-all duration-300"
        style={{
          background: isFocused ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
          border: isFocused ? "1.5px solid #81B29A" : "1.5px solid rgba(61,64,91,0.12)",
          borderRadius: 16,
          padding: "6px 8px 6px 18px",
          boxShadow: isFocused
            ? "0 8px 32px rgba(129,178,154,0.18), 0 0 0 4px rgba(129,178,154,0.08)"
            : "0 4px 16px rgba(61,64,91,0.06)",
        }}
      >
        {/* Search Icon */}
        <SearchIcon
          size={20}
          className="shrink-0 transition-colors duration-200"
          style={{ color: isFocused ? "#81B29A" : "rgba(61,64,91,0.38)" }}
        />

        {/* Input - Shortened placeholder for mobile */}
        <input
          ref={inputRef}
          type="text"
          placeholder={window.innerWidth < 640 ? "Search queues..." : "Search by name, category, or location..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 min-w-0 outline-none text-[15px]"
          style={{
            background: "transparent",
            color: "#3D405B",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            padding: "10px 0",
            letterSpacing: "-0.01em",
          }}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 flex items-center justify-center transition-all duration-200"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              color: "rgba(61,64,91,0.45)",
              background: "rgba(61,64,91,0.06)",
            }}
          >
            <XIcon size={16} />
          </button>
        )}

        {/* Search Action Hint */}
        {!value && !isFocused && (
          <div
            className="hidden sm:flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(61,64,91,0.05)",
              color: "rgba(61,64,91,0.36)",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
            }}
          >
            <SparklesIcon size={12} />
            Live
          </div>
        )}
      </div>
    </form>
  );
};

export default BusinessSearchBar;
