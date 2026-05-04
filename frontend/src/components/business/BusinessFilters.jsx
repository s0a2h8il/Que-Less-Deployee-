import React from "react";
import { Filter, ChevronDown } from "lucide-react";

const BusinessFilters = ({ filters, setFilters }) => {
  const categories = [
    "All",
    "Clinic",
    "Salon",
    "Restaurant",
    "Bank",
    "Government Office",
    "Retail Store",
    "Other",
  ];

  const cities = [
    "All",
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Mumbai",
    "Pune",
    "Delhi",
    "Bangalore",
  ];

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-4 py-6"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center gap-2 pr-4 hidden md:flex"
        style={{
          borderRight: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Filter size={18} />
        <span className="text-sm font-bold uppercase tracking-wider">
          Filters
        </span>
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ category: cat === "All" ? "" : cat })}
              style={{
                background:
                  filters.category === cat ||
                  (cat === "All" && !filters.category)
                    ? "#81B29A"
                    : "var(--surface)",
                color:
                  filters.category === cat ||
                  (cat === "All" && !filters.category)
                    ? "white"
                    : "var(--text-secondary)",
                border:
                  filters.category === cat ||
                  (cat === "All" && !filters.category)
                    ? "1px solid #81B29A"
                    : "1px solid var(--border)",
                boxShadow:
                  filters.category === cat ||
                  (cat === "All" && !filters.category)
                    ? "0 4px 12px rgba(129, 178, 154, 0.15)"
                    : "none",
              }}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div
        className="hidden md:block h-8 w-[1px]"
        style={{ background: "var(--border)" }}
      />

      {/* City Filter */}
      <div className="relative w-full md:w-48 group">
        <select
          value={filters.city || "All"}
          onChange={(e) =>
            setFilters({ city: e.target.value === "All" ? "" : e.target.value })
          }
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
          }}
          className="w-full appearance-none text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:border-transition-all cursor-pointer"
          onFocus={(e) => {
            e.target.style.borderColor = "#81B29A";
            e.target.style.boxShadow = "0 0 0 3px rgba(129, 178, 154, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default BusinessFilters;
