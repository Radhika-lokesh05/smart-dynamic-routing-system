import React, { useState } from 'react';
import { Siren, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyToggle = ({ isActive, onToggle }) => {
  return (
    <div className={`glass-card p-6 overflow-hidden relative ${isActive ? 'ring-2 ring-red-500/50' : ''}`}>
      {isActive && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 pointer-events-none"
        />
      )}
      
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isActive ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            <Siren size={24} className={isActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Emergency Mode</h3>
            <p className="text-sm text-slate-400">Path pre-emption & priority</p>
          </div>
        </div>

        <button 
          onClick={onToggle}
          className={`relative px-6 py-2 rounded-full font-bold transition-all duration-500 overflow-hidden ${
            isActive ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span className="relative z-10">{isActive ? 'STOP' : 'ACTIVATE'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="relative z-10 space-y-4"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <p>Priority route broadcasted. Traffic signals in your path are being cleared. Drive with caution.</p>
            </div>

            {/* NEW: V2X Node Control Dashboard */}
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                <span>V2X Node Control</span>
                <span className="text-red-500 animate-pulse">Live Uplink</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <NodeStatus label="Node-B (Sambhram)" status="CLEARED" color="red" />
                <NodeStatus label="Node-D (Cross-X)" status="ACTIVE" color="blue" />
                <NodeStatus label="Signal-77" status="HOLDING" color="amber" />
                <NodeStatus label="Bridge-Link" status="CLEARING" color="green" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NodeStatus = ({ label, status, color }) => (
  <div className="flex flex-col gap-1 p-2 rounded-lg bg-white/5 border border-white/5">
    <span className="text-[9px] font-bold text-slate-500 uppercase">{label}</span>
    <div className="flex items-center gap-1.5">
      <div className={`w-1 h-1 rounded-full bg-${color}-500 animate-pulse`} />
      <span className={`text-[10px] font-black text-${color}-400`}>{status}</span>
    </div>
  </div>
);

export default EmergencyToggle;
