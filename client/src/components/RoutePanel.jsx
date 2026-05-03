import React from 'react';
import { Navigation, Clock, Fuel, ShieldCheck, ArrowRight, History, Sparkles } from 'lucide-react';

const RoutePanel = ({ onStartNavigation, isOptimizing, routeData, vehicleType = 'petrol' }) => {
  // Helper to calculate fuel/energy cost
  const calculateFuelCost = (distance) => {
    if (!distance || isNaN(parseFloat(distance))) return "0.00";
    const d = parseFloat(distance);
    
    // Config: [Rate per km]
    const rates = {
      petrol: 8.5,  // Rs. 8.5/km (Sedan)
      diesel: 7.2,  // Rs. 7.2/km (SUV)
      ev: 1.8       // Rs. 1.8/km (Electric)
    };
    
    return (d * rates[vehicleType]).toFixed(2);
  };

  // Helper to calculate arrival time
  const calculateArrival = (minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper to format time into hours/minutes
  const formatTime = (minutes) => {
    if (!minutes) return "--";
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
  };

  // Extract specific routes from the backend response
  const bestRoute = routeData?.routes?.find(r => r.type === 'best');
  const ecoRoute = routeData?.routes?.find(r => r.type === 'eco');

  // Direct metrics from backend (No hardcoded values)
  const fastestETA = bestRoute ? formatTime(bestRoute.time) : "-- min";
  const fastestArrival = bestRoute ? calculateArrival(bestRoute.time) : "--:--";
  const fastestDist = bestRoute ? `${bestRoute.distance} km` : "-- km";
  const fastestCost = bestRoute ? calculateFuelCost(bestRoute.distance) : "0.00";
  const fastestTraffic = bestRoute ? bestRoute.traffic.charAt(0).toUpperCase() + bestRoute.traffic.slice(1) : "N/A";
  
  const ecoETA = ecoRoute ? formatTime(ecoRoute.time) : "-- min";
  const ecoArrival = ecoRoute ? calculateArrival(ecoRoute.time) : "--:--";
  const ecoDist = ecoRoute ? `${ecoRoute.distance} km` : "-- km";
  const ecoCost = ecoRoute ? calculateFuelCost(ecoRoute.distance) : "0.00";
  const ecoTraffic = ecoRoute ? ecoRoute.traffic.charAt(0).toUpperCase() + ecoRoute.traffic.slice(1) : "N/A";

  const routeInfo = bestRoute ? `Path: ${bestRoute.path.join(' → ')}` : "Select a route to begin optimization";

  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Navigation className="text-blue-500" size={20} />
        <h3 className="text-lg font-bold">Pathfinder</h3>
      </div>

      <div className="space-y-6">
        {/* Active Suggestions */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} className="text-amber-400" />
            AI Recommendations
          </h4>
          <RouteOption 
            title="Fastest Route"
            eta={fastestETA}
            arrival={fastestArrival}
            distance={fastestDist}
            cost={fastestCost}
            vehicleType={vehicleType}
            traffic={fastestTraffic}
            info={routeInfo}
            icon={<Clock size={18} />}
            active={true}
          />
          <RouteOption 
            title="Eco-Friendly"
            eta={ecoETA}
            arrival={ecoArrival}
            distance={ecoDist}
            cost={ecoCost}
            vehicleType={vehicleType}
            traffic={ecoTraffic}
            info="Optimized for fuel & CO2"
            icon={<Fuel size={18} />}
            color="green"
          />
        </div>

        {/* NEW: Fuel & Energy Analysis Block */}
        {bestRoute && (
          <div className="pt-4 border-t border-white/5 animate-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Fuel size={12} className="text-green-400" />
              Fuel & Energy Analysis
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <AnalysisMetric 
                label="Total Distance" 
                value={`${bestRoute.distance} km`} 
                sub="Trip Length"
              />
              <AnalysisMetric 
                label="Efficiency" 
                value={vehicleType === 'ev' ? '6.2 km/kWh' : vehicleType === 'diesel' ? '18 km/L' : '14.5 km/L'} 
                sub="Avg. Mileage"
              />
              <AnalysisMetric 
                label="Current Rate" 
                value={vehicleType === 'ev' ? 'Rs. 8.5/unit' : vehicleType === 'diesel' ? 'Rs. 92.4/L' : 'Rs. 101.2/L'} 
                sub="Market Price"
              />
              <AnalysisMetric 
                label="EST. TOTAL COST" 
                value={vehicleType === 'ev' ? `${(fastestCost/8.5).toFixed(1)} kWh` : `Rs. ${fastestCost}`} 
                sub="Computed Total"
                highlight={true}
              />
            </div>
          </div>
        )}

        {/* History-based suggestions */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <History size={12} />
            Based on your history
          </h4>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 group cursor-pointer hover:bg-amber-500/10 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-amber-200">Usual Commute</span>
              <span className="text-xs text-slate-400 font-bold italic">ETA: 18 min</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">You typically take this route on Thursdays.</p>
            <div className="flex gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">📍 12.5 km</span>
              <span className="flex items-center gap-1">🚦 Moderate</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onStartNavigation}
        disabled={isOptimizing}
        className={`w-full mt-auto py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-white ${
          isOptimizing 
            ? 'bg-blue-800 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
        }`}
      >
        {isOptimizing ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
            OPTIMIZING...
          </>
        ) : (
          <>
            START NAVIGATION <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
};

const RouteOption = ({ title, eta, arrival, distance, cost, vehicleType, traffic, info, icon, color = 'blue', active = false }) => (
  <div className={`p-4 rounded-xl cursor-pointer transition-all border ${
    active 
      ? `bg-blue-500/10 border-blue-500/50 shadow-inner` 
      : `bg-slate-800/50 border-white/5 hover:border-white/20`
  }`}>
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <span className={active ? 'text-blue-400' : `text-${color}-400`}>{icon}</span>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-200">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">ETA: {eta}</span>
            <span className="text-[10px] text-slate-500 font-bold">Arrives at: {arrival}</span>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col gap-1">
        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-300">
          <span>📍</span> {distance}
        </div>
        <div className="flex items-center justify-end gap-1 text-[10px] font-black text-green-400">
          <span>{vehicleType === 'ev' ? '⚡' : '⛽'}</span> 
          {vehicleType === 'ev' ? `${(cost/8).toFixed(1)} kWh` : `Rs. ${cost}`}
        </div>
      </div>
    </div>
    
    <div className="flex justify-between items-center ml-7">
      <p className="text-[11px] text-slate-400 line-clamp-1">{info}</p>
      <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-white/5">
        <div className={`w-1 h-1 rounded-full ${traffic === 'Heavy' ? 'bg-red-500' : traffic === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'}`} />
        {traffic}
      </div>
    </div>
  </div>
);

const AnalysisMetric = ({ label, value, sub, highlight = false }) => (
  <div className={`p-3 rounded-xl border ${
    highlight 
      ? 'bg-green-500/10 border-green-500/30' 
      : 'bg-white/5 border-white/5'
  }`}>
    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-sm font-black ${highlight ? 'text-green-400' : 'text-slate-200'}`}>{value}</div>
    <div className="text-[9px] text-slate-600 font-bold">{sub}</div>
  </div>
);

export default RoutePanel;
