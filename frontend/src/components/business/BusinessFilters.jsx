import React from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const BusinessFilters = ({ filters, setFilters }) => {
  const categories = [
    "All", "Clinic", "Salon", "Restaurant", "Bank", "Government Office", "Retail Store", "Other"
  ];

  const cities = [
    "All", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Mumbai", "Pune", "Delhi", "Bangalore"
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 py-6 border-b border-slate-100">
      <div className="flex items-center gap-2 text-slate-400 pr-4 border-r border-slate-100 hidden md:flex">
        <Filter size={18} />
        <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ category: cat === "All" ? "" : cat })}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
                (filters.category === cat || (cat === "All" && !filters.category))
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block h-8 w-[1px] bg-slate-100 mx-2" />

      {/* City Filter */}
      <div className="relative w-full md:w-48 group">
        <select
          value={filters.city || "All"}
          onChange={(e) => setFilters({ city: e.target.value === "All" ? "" : e.target.value })}
          className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600">
           <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default BusinessFilters;
