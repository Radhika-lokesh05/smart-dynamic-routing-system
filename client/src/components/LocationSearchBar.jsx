import React, { useState } from 'react';
import { MapPin, Navigation2, Search, ArrowRightLeft, Loader2, Crosshair } from 'lucide-react';

const LocationSearchBar = ({ onFindRoute }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Format as a string that our backend can recognize
        setSource(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination) {
      onFindRoute(source, destination);
    }
  };

  return (
    <div className="glass-card p-6 w-full mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 transition-transform group-focus-within:scale-110">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            placeholder="Starting Point..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-slate-200 placeholder:text-slate-600"
          />
          <button 
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/20 transition-all"
          >
            {isLocating ? <Loader2 className="animate-spin" size={14} /> : <Crosshair size={14} />}
            {isLocating ? 'LOCATING...' : 'LOCATE ME'}
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center text-slate-600 bg-white/5 p-2 rounded-full border border-white/5">
          <ArrowRightLeft size={18} />
        </div>

        <div className="flex-1 w-full relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 transition-transform group-focus-within:scale-110">
            <Navigation2 size={18} />
          </div>
          <input
            type="text"
            placeholder="Destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-slate-200 placeholder:text-slate-600"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 group active:scale-95"
        >
          <Search size={18} className="group-hover:scale-110 transition-transform" />
          FIND ROUTE
        </button>
      </form>
    </div>
  );
};

export default LocationSearchBar;
