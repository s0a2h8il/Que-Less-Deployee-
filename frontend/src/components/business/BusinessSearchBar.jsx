import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button, Input } from "..";

const BusinessSearchBar = ({ onSearch, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);

  // Synchronize internal state with parent if necessary
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: value });
  };

  const handleClear = () => {
    setValue("");
    onSearch({ search: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto -mt-8 z-10 px-4">
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex-1">
          <Input
            placeholder="Search clinics, salons, restaurants..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            icon={Search}
            className="border-none focus-visible:ring-0 shadow-none h-12"
            fullWidth
          />
        </div>
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        )}

        <Button type="submit" className="h-12 px-8 rounded-xl shadow-lg shadow-blue-200">
           Search
        </Button>
      </div>
    </form>
  );
};

export default BusinessSearchBar;
