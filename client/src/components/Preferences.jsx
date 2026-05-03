import React, { useState } from 'react';
import { Settings, Clock, Shield, Leaf, Coffee } from 'lucide-react';

const Preferences = ({ weights, onChange, vehicleType, onVehicleChange }) => {
  const handleChange = (key, val) => {
    onChange(key, val);
  };

  return (
    <div className="glass-card p-6 space-y-8">
      {/* Vehicle Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="text-green-500" size={20} />
          <h3 className="text-lg font-bold">Vehicle Profile</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['petrol', 'diesel', 'ev'].map((type) => (
            <button
              key={type}
              onClick={() => onVehicleChange(type)}
              className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                vehicleType === type 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Weights */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-blue-500" size={20} />
          <h3 className="text-lg font-bold">Optimization Weights</h3>
        </div>
        
        <div className="space-y-6">
          <WeightSlider 
            label="Time Efficiency" 
            icon={<Clock size={16} />} 
            value={weights.time} 
            onChange={(v) => handleChange('time', v)} 
            color="blue"
          />
          <WeightSlider 
            label="Safety Priority" 
            icon={<Shield size={16} />} 
            value={weights.safety} 
            onChange={(v) => handleChange('safety', v)} 
            color="amber"
          />
          <WeightSlider 
            label="Fuel/Eco Focus" 
            icon={<Leaf size={16} />} 
            value={weights.fuel} 
            onChange={(v) => handleChange('fuel', v)} 
            color="green"
          />
          <WeightSlider 
            label="Driving Comfort" 
            icon={<Coffee size={16} />} 
            value={weights.comfort} 
            onChange={(v) => handleChange('comfort', v)} 
            color="indigo"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Current Profile:</span>
            <span className="text-blue-400 font-bold uppercase tracking-wider">Custom AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeightSlider = ({ label, icon, value, onChange, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-slate-300">
        <span className={`text-${color}-400`}>{icon}</span>
        {label}
      </div>
      <span className="font-mono text-slate-400">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  </div>
);

export default Preferences;
