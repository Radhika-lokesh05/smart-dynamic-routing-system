import React, { useState } from 'react';
import { Bell, AlertTriangle, Users, MapPin, X, CheckCircle2 } from 'lucide-react';

const AlertPanel = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [reports, setReports] = useState([
    { 
      id: 1, 
      type: 'HAZARD', 
      text: 'Heavy flooding reported', 
      location: 'BEL Circle',
      time: '2m ago',
      color: 'red'
    },
    { 
      id: 2, 
      type: 'CROWD', 
      text: 'Slow traffic detected', 
      location: 'Yeshwanthpur',
      time: '5m ago',
      color: 'blue'
    },
  ]);

  const handleReport = (e) => {
    e.preventDefault();
    const type = e.target.type.value;
    const location = e.target.location.value;
    
    const newReport = {
      id: Date.now(),
      type: 'USER-REPORT',
      text: `${type} reported by user`,
      location: location,
      time: 'Just now',
      color: 'amber'
    };

    setReports([newReport, ...reports]);
    setIsReporting(false);
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500" size={20} />
          <h3 className="text-lg font-bold">Smart Alerts</h3>
        </div>
        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {reports.map(alert => (
          <div key={alert.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                alert.color === 'red' ? 'text-red-400' : 
                alert.color === 'amber' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                {alert.type}
              </span>
              <span className="text-[10px] text-slate-500">{alert.time}</span>
            </div>
            <p className="text-sm text-slate-200 mb-3 font-medium">{alert.text}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={12} />
              {alert.location}
            </div>
          </div>
        ))}
      </div>
      
      {!isReporting ? (
        <button 
          onClick={() => setIsReporting(true)}
          className="mt-6 w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-xs font-bold transition-all border border-blue-500/20"
        >
          REPORT NEW INCIDENT
        </button>
      ) : (
        <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-blue-500/50 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-blue-400 uppercase">New Incident</span>
            <button onClick={() => setIsReporting(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
          </div>
          <form onSubmit={handleReport} className="space-y-3">
            <select name="type" className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-blue-500">
              <option>Road Closure</option>
              <option>Heavy Traffic</option>
              <option>Accident</option>
              <option>Weather Hazard</option>
            </select>
            <input 
              name="location"
              placeholder="Enter location..."
              required
              className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-900/40">
              SUBMIT ALERT
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
