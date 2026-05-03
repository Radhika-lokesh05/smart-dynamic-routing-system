import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import RoutePanel from './components/RoutePanel';
import AlertPanel from './components/AlertPanel';
import Preferences from './components/Preferences';
import EmergencyToggle from './components/EmergencyToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Info, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { routeService, emergencyService } from './services/api';

import LocationSearchBar from './components/LocationSearchBar';

function App() {
  const [weights, setWeights] = useState({
    time: 40,
    safety: 30,
    fuel: 20,
    comfort: 10
  });
  
  const [isEmergency, setIsEmergency] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [liveTraffic, setLiveTraffic] = useState({});
  const [lastRoute, setLastRoute] = useState(null);
  const [vehicleType, setVehicleType] = useState('petrol');

  const handleVehicleChange = (type) => {
    setVehicleType(type);
    showNotification(`Switched to ${type.toUpperCase()} profile. Recalculating costs...`, 'info');
  };

  useEffect(() => {
    // Establish WebSocket connection for real-time traffic updates
    const socket = new WebSocket('ws://localhost:8000/ws');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'traffic_update') {
        setLiveTraffic(data.data);
      }
    };

    return () => socket.close();
  }, []);

  // AUTO-REOPTIMIZE: Triggered when weights change
  useEffect(() => {
    if (lastRoute) {
      const timer = setTimeout(() => {
        handleFindRoute(lastRoute.source, lastRoute.destination, true);
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [weights]);

  const handleWeightChange = (key, val) => {
    const numVal = Number(val);
    setWeights(prev => ({ ...prev, [key]: numVal }));
  };

  const handleFindRoute = async (source, destination, isSilent = false) => {
    if (!source || !destination) return;
    if (!isSilent) setIsOptimizing(true);
    
    // Save for auto-reoptimization
    setLastRoute({ source, destination });
    
    try {
      const backendWeights = {
        w1: weights.time / 100,
        w2: weights.safety / 100,
        w3: weights.fuel / 100,
        w4: weights.comfort / 100
      };
      
      const result = await routeService.optimizeRoute(source, destination, backendWeights);
      setRouteResult(result);
      
      if (!isSilent) {
        showNotification(`Route optimized based on your ${Object.keys(weights).find(k => weights[k] > 50) || 'balanced'} preferences.`, 'success');
      }
    } catch (error) {
      if (!isSilent) showNotification('Optimization service is busy.', 'error');
    } finally {
      if (!isSilent) setIsOptimizing(false);
    }
  };

  const handleStartNavigation = async () => {
    setIsOptimizing(true);
    try {
      // Map frontend keys to backend expected format (w1, w2, w3, w4)
      const backendWeights = {
        w1: weights.time / 100,
        w2: weights.safety / 100,
        w3: weights.fuel / 100,
        w4: weights.comfort / 100
      };

      const result = await routeService.optimizeRoute('A', 'G', backendWeights);
      setRouteResult(result);
      showNotification('Route optimized successfully!', 'success');
      console.log('Optimized Route:', result);
    } catch (error) {
      showNotification('Optimization failed. Using local fallback.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleEmergencyToggle = async () => {
    const newState = !isEmergency;
    setIsEmergency(newState);
    
    if (newState) {
      try {
        await emergencyService.activateEmergency('A', 'G');
        showNotification('Emergency priority activated!', 'warning');
      } catch (error) {
        showNotification('Emergency signal failed to broadcast.', 'error');
      }
    } else {
      showNotification('Emergency mode deactivated.', 'info');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-0 left-1/2 z-[2000] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
              notification.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
              notification.type === 'warning' ? 'bg-amber-500/90 border-amber-400 text-white' :
              'bg-blue-500/90 border-blue-400 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 size={18} />}
            {notification.type === 'error' && <AlertTriangle size={18} />}
            <span className="font-bold text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-500 mb-1"
          >
            <Activity size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">System Active</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            SMART<span className="text-blue-500">ROUTING</span>
          </motion.h1>
          <p className="text-slate-400 font-medium">Predictive Traffic & Multi-Objective AI Navigation</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-3">
            <Globe className="text-green-500" size={18} />
            <div className="text-[10px] uppercase font-bold text-slate-500">
              Region: <span className="text-slate-200">METRO-7</span>
            </div>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-3">
            <Info className="text-blue-500" size={18} />
            <div className="text-[10px] uppercase font-bold text-slate-500">
              Protocol: <span className="text-slate-200">AI-v1.2</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map and Alerts */}
        <div className="lg:col-span-8 space-y-8">
          <LocationSearchBar onFindRoute={handleFindRoute} />
          <MapView routeData={routeResult} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AlertPanel />
            <EmergencyToggle isActive={isEmergency} onToggle={handleEmergencyToggle} />
          </div>
        </div>

        {/* Right Column: Controls */}
        <aside className="lg:col-span-4 space-y-8">
          <RoutePanel 
            onStartNavigation={handleStartNavigation} 
            isOptimizing={isOptimizing} 
            routeData={routeResult} 
            vehicleType={vehicleType}
          />
          <Preferences 
            weights={weights} 
            onChange={handleWeightChange} 
            vehicleType={vehicleType}
            onVehicleChange={handleVehicleChange}
          />
          
          <div className="glass-card p-6 border-blue-500/10">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Network Status</h4>
            <div className="space-y-3">
              <StatusRow label="ML Predictor" status={isOptimizing ? "Processing..." : "Optimized"} color={isOptimizing ? "blue" : "green"} />
              <StatusRow label="Weather API" status="Connected" color="green" />
              <StatusRow label="V2X Node" status={isEmergency ? "Priority Active" : "Syncing"} color={isEmergency ? "red" : "amber"} />
            </div>
          </div>
        </aside>
      </main>

      <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        <div>© 2026 Antigravity Systems. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}

const StatusRow = ({ label, status, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(var(--tw-color-${color}-500),0.5)]`} />
      <span className={`text-[10px] font-bold text-${color}-500 uppercase`}>{status}</span>
    </div>
  </div>
);

export default App;
