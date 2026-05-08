import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  ChevronDown, 
  Stethoscope, 
  Scissors, 
  UtensilsCrossed, 
  Landmark, 
  Building, 
  Store, 
  MoreHorizontal, 
  LayoutGrid,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Car,
  Briefcase,
  Smartphone
} from "lucide-react";
import { businessApi } from "../../api/businessApi";

const categoryIconMap = {
  all: LayoutGrid,
  clinic: Stethoscope,
  healthcare: HeartPulse,
  medical: Stethoscope,
  salon: Scissors,
  spa: Scissors,
  restaurant: UtensilsCrossed,
  food: UtensilsCrossed,
  cafe: Coffee,
  bank: Landmark,
  finance: Landmark,
  government: Building,
  retail: Store,
  shop: ShoppingBag,
  education: GraduationCap,
  school: GraduationCap,
  automotive: Car,
  services: Briefcase,
  tech: Smartphone,
};

const getCategoryIcon = (category) => {
  const normalized = category.toLowerCase();
  
  // Direct match
  if (categoryIconMap[normalized]) return categoryIconMap[normalized];
  
  // Keyword match
  const entry = Object.entries(categoryIconMap).find(([key]) => 
    normalized.includes(key) || key.includes(normalized)
  );
  
  return entry ? entry[1] : MoreHorizontal;
};

const BusinessFilters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState(["All"]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await businessApi.getCategories();
        if (res.success) {
          // Normalize and sort categories
          const fetchedCats = res.data.categories.map(c => 
            c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
          );
          setCategories(["All", ...new Set(fetchedCats)]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const isActiveCategory = (cat) =>
    filters.category?.toLowerCase() === cat.toLowerCase() || (cat === "All" && !filters.category);

  return (
    <div className="flex flex-col gap-4">
      {/* Category + City Container - Now Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-3">
        
        {/* Category Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Label */}
          <span
            className="hidden xl:block text-[10px] font-black uppercase tracking-[0.16em] shrink-0"
            style={{
              color: "rgba(61,64,91,0.38)",
              fontFamily: "var(--font-body)",
            }}
          >
            Category
          </span>

          {/* Scrollable Category Pills */}
          <div
            className="flex-1 overflow-x-auto no-scrollbar py-1"
            style={{
              maskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, black 90%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-2 pr-12">
              {categories.map((cat) => {
                const active = isActiveCategory(cat);
                const Icon = getCategoryIcon(cat);
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setFilters({ category: cat === "All" ? "" : cat })
                    }
                    className="group flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 shrink-0"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, #81B29A 0%, #6FA88A 100%)"
                        : "rgba(61, 64, 91, 0.04)",
                      color: active ? "white" : "rgba(61, 64, 91, 0.58)",
                      border: active
                        ? "1px solid rgba(129,178,154,0.30)"
                        : "1px solid rgba(61,64,91,0.08)",
                      boxShadow: active
                        ? "0 4px 14px rgba(129,178,154,0.25)"
                        : "none",
                      fontFamily: "var(--font-body)",
                      transform: active ? "translateY(-1px)" : "none",
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
        </div>

        {/* Divider - Only visible on wide screens */}
        <div
          className="hidden lg:block h-7 w-px shrink-0"
          style={{ background: "rgba(61,64,91,0.10)" }}
        />

        {/* City Select Section */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="lg:hidden text-[10px] font-black uppercase tracking-[0.16em] shrink-0"
            style={{
              color: "rgba(61,64,91,0.38)",
              fontFamily: "var(--font-body)",
            }}
          >
            Location
          </span>
          <div className="relative flex-1 sm:flex-initial">
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
              className="appearance-none outline-none cursor-pointer transition-all duration-200 w-full sm:w-auto"
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
    </div>
  );
};

export default BusinessFilters;
