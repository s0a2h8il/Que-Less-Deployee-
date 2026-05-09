import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Minimize2, Check, MapPin, Search, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";

// CSS to hide default zoom controls that might override the prop
const hideDefaultControls = `
  .leaflet-control-zoom { display: none !important; }
`;

// Fix for default marker icon in leaflet with React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onAddressSelect, initialPos = [21.1702, 72.8311] }) => {
  const [position, setPosition] = useState(initialPos);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Component to handle map clicks and size updates
  function MapLogic() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
      },
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
        if (position) map.setView(position, map.getZoom());
      }, 300);
      return () => clearTimeout(timer);
    }, [isFullscreen, map, position]);

    return position === null ? null : (
      <Marker position={position} />
    );
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchResults([]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
      
      if (data && data.length === 1) {
        selectResult(data[0]);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectResult = (result) => {
    const { lat, lon } = result;
    const newPos = [parseFloat(lat), parseFloat(lon)];
    setPosition(newPos);
    fetchAddress(newPos[0], newPos[1]);
    setShowResults(false);
    setSearchQuery(result.display_name.split(",").slice(0, 3).join(", "));
  };

  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const mainName = data.name || "";
        
        // 1. Identify specific Building/Society/Complex
        const building = addr.building || addr.apartments || addr.house_name || addr.office || addr.shop || addr.amenity || addr.industrial || addr.commercial || addr.attraction || addr.place || "";
        const society = addr.residential || addr.condominium || addr.flats || "";
        const house = addr.house_number || "";
        const road = addr.road || addr.pedestrian || addr.path || "";
        
        // 2. Identify Area/Neighborhood/Village
        const neighborhood = addr.suburb || addr.neighbourhood || addr.quarter || "";
        const village = addr.village || addr.hamlet || addr.allotments || "";
        const district = addr.city_district || addr.subdivision || "";
        
        const city = addr.city || addr.town || addr.municipality || "";
        const state = addr.state || "";
        const pincode = addr.postcode || "";

        let line1Parts = [];
        const isGeneric = [road, neighborhood, village, city, district, state].some(v => v && mainName.toLowerCase() === v.toLowerCase());
        if (mainName && !isGeneric) line1Parts.push(mainName);

        [building, society].forEach(val => {
          if (val && !line1Parts.some(p => p.toLowerCase() === val.toLowerCase())) line1Parts.push(val);
        });

        if (house) line1Parts.push(house);
        if (road) line1Parts.push(road);

        let line1 = line1Parts.filter(Boolean).join(", ");

        const displayNameParts = data.display_name.split(",").map(p => p.trim());
        if (!line1 || line1.toLowerCase() === city.toLowerCase()) {
          line1 = displayNameParts[0];
          if (displayNameParts.length > 1 && (line1.toLowerCase() === city.toLowerCase() || neighborhood.toLowerCase() === line1.toLowerCase())) {
            line1 = displayNameParts[0] + ", " + displayNameParts[1];
          }
        }

        let areaName = neighborhood || village || district || "";
        if (line1.toLowerCase().includes(areaName.toLowerCase()) && neighborhood && village) {
          areaName = village;
        } else if (line1.toLowerCase().includes(areaName.toLowerCase()) && district) {
          areaName = district;
        }
        
        if (areaName.toLowerCase() === line1.toLowerCase() || areaName.toLowerCase() === city.toLowerCase()) {
          areaName = (neighborhood && neighborhood.toLowerCase() !== line1.toLowerCase()) ? neighborhood : (village || district || "");
        }
        if (areaName.toLowerCase() === line1.toLowerCase()) areaName = "";

        const addressData = {
          addressLine1: line1,
          addressLine2: "", 
          areaName: areaName,
          city: city,
          state: state,
          pincode: pincode,
          fullAddress: data.display_name
        };
        
        setCurrentAddress(data.display_name);
        onAddressSelect(addressData);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFullscreen(!isFullscreen);
  };

  const SearchOverlay = (
    <div className="absolute top-4 left-0 right-0 z-[1002] px-4 flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-md flex flex-col pointer-events-auto">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-[0_8px_20px_rgba(61,64,91,0.04)] border-2 border-transparent transition-all duration-500 ease-out ring-2 ring-transparent ring-offset-2 ring-offset-white focus-within:border-[#0B1320] focus-within:ring-[#0B1320] focus-within:bg-white">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search society, building or area..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (showResults) setShowResults(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <Maximize2 size={16} className="rotate-45" /> {/* Close icon substitute */}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                {searchResults.length > 0 ? "Suggestions" : "No results found"}
              </span>
              <button 
                onClick={() => setShowResults(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <Minimize2 size={14} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectResult(result)}
                    className="w-full text-left p-3 hover:bg-indigo-50 transition-colors flex items-start gap-3 border-b border-slate-50 last:border-0"
                  >
                    <div className="mt-0.5 p-1.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">
                        {result.display_name.split(",")[0]}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {result.display_name.split(",").slice(1).join(",").trim()}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500 mb-2 font-medium">We couldn't find "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Try searching for a broader area (e.g. "Vesu, Surat") and then click the exact spot on the map.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{hideDefaultControls}</style>
      {/* Inline View */}
      <div 
        className={cn(
          "h-80 w-full rounded-2xl border border-slate-200 shadow-inner flex flex-col relative overflow-hidden bg-slate-50 transition-all",
          isFullscreen && "invisible"
        )}
      >
        {!isFullscreen && (
          <div className="flex-1 w-full relative">
            {SearchOverlay}
            <MapContainer 
              center={position} 
              zoom={13} 
              scrollWheelZoom={false}
              zoomControl={false}
              style={{ height: "100%", width: "100%" }}
              doubleClickZoom={false}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapLogic />
            </MapContainer>

            <div className="absolute bottom-4 right-4 z-[1001] flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <Maximize2 size={20} />
              </button>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-[1001] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-indigo-700">Searching...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Portal */}
      {isFullscreen && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-50 p-4 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm -z-10" onClick={() => setIsFullscreen(false)} />
          
          <div className="flex items-center justify-between mb-4 px-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Precise Location Picker</h3>
                <p className="text-xs text-slate-500 truncate max-w-md lg:max-w-2xl font-medium">
                  {currentAddress || "Search or click map to pick address"}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Check size={20} /> Done Picking
            </button>
          </div>
          
          <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative bg-white">
            {SearchOverlay}
            <MapContainer 
              center={position} 
              zoom={13} 
              scrollWheelZoom={true}
              zoomControl={false}
              style={{ height: "100%", width: "100%" }}
              doubleClickZoom={false}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapLogic />
            </MapContainer>

            <div className="absolute bottom-4 right-4 z-[1001] flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <Minimize2 size={24} />
              </button>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-[1001] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-bold text-indigo-700">Locating...</span>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LocationPicker;
