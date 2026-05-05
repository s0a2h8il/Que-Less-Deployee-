import React from "react";
import { MapPin, ChevronDown, Stethoscope, Scissors, UtensilsCrossed, Landmark, Building, Store, MoreHorizontal, LayoutGrid } from "lucide-react";

const categoryIcons = {
  All: LayoutGrid,
  Clinic: Stethoscope,
  Salon: Scissors,
  Restaurant: UtensilsCrossed,
  Bank: Landmark,
  "Government Office": Building,
  "Retail Store": Store,
  Other: MoreHorizontal,
};

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

  const isActiveCategory = (cat) =>
    filters.category === cat || (cat === "All" && !filters.category);

  return (
    <div className="flex flex-col gap-4">
      {/* Category Pills Row */}
      <div className="flex items-center gap-3">
        {/* Label */}
        <span
          className="hidden md:block text-[10px] font-black uppercase tracking-[0.16em] shrink-0"
          style={{
            color: "rgba(61,64,91,0.38)",
            fontFamily: "var(--font-body)",
          }}
        >
          Category
        </span>

        {/* Scrollable Category Pills */}
        <div
          className="flex-1 overflow-x-auto no-scrollbar"
          style={{
            maskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
          }}
        >
          <div className="flex gap-2 py-0.5 pr-6">
            {categories.map((cat) => {
              const active = isActiveCategory(cat);
              const Icon = categoryIcons[cat] || LayoutGrid;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setFilters({ category: cat === "All" ? "" : cat })
                  }
                  className="group flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #81B29A 0%, #6FA88A 100%)"
                      : "rgba(61,64,91,0.04)",
                    color: active ? "white" : "rgba(61,64,91,0.58)",
                    border: active
                      ? "1px solid rgba(129,178,154,0.30)"
                      : "1px solid rgba(61,64,91,0.08)",
                    boxShadow: active
                      ? "0 4px 14px rgba(129,178,154,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
                      : "none",
                    fontFamily: "var(--font-body)",
                    transform: active ? "translateY(-1px)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(61,64,91,0.08)";
                      e.currentTarget.style.color = "#3D405B";
                      e.currentTarget.style.borderColor = "rgba(61,64,91,0.14)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(61,64,91,0.04)";
                      e.currentTarget.style.color = "rgba(61,64,91,0.58)";
                      e.currentTarget.style.borderColor = "rgba(61,64,91,0.08)";
                    }
                  }}
                >
                  <Icon
                    size={14}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block h-7 w-px shrink-0"
          style={{ background: "rgba(61,64,91,0.10)" }}
        />

        {/* City Select */}
        <div className="relative shrink-0">
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: filters.city ? "#E07A5F" : "rgba(61,64,91,0.34)" }}
          >
            <MapPin size={14} />
          </div>
          <select
            value={filters.city || "All"}
            onChange={(e) =>
              setFilters({
                city: e.target.value === "All" ? "" : e.target.value,
              })
            }
            className="appearance-none outline-none cursor-pointer transition-all duration-200"
            style={{
              background: filters.city
                ? "rgba(224,122,95,0.08)"
                : "rgba(61,64,91,0.04)",
              border: filters.city
                ? "1px solid rgba(224,122,95,0.24)"
                : "1px solid rgba(61,64,91,0.08)",
              borderRadius: 12,
              padding: "8px 34px 8px 28px",
              fontSize: 13,
              fontWeight: 600,
              color: filters.city ? "#E07A5F" : "rgba(61,64,91,0.58)",
              fontFamily: "var(--font-body)",
              minWidth: 140,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#E07A5F";
              e.target.style.boxShadow =
                "0 0 0 3px rgba(224,122,95,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = filters.city
                ? "rgba(224,122,95,0.24)"
                : "rgba(61,64,91,0.08)";
              e.target.style.boxShadow = "none";
            }}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === "All" ? "All Cities" : city}
              </option>
            ))}
          </select>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: filters.city ? "#E07A5F" : "rgba(61,64,91,0.34)" }}
          >
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessFilters;
