import React from 'react';
import { getCategoryInfo } from '../../services/AppCategorizer';

/**
 * AppUsageCard — Mini card showing a recorded app usage entry
 * Used in Timeline to show what apps were used and when
 */
export default function AppUsageCard({ entry, isAurora = false }) {
  const catInfo = getCategoryInfo(entry.category);
  
  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return '--:--';
    }
  };

  const startTime = formatTime(entry.startTime);
  const endTime = formatTime(entry.endTime);
  const duration = entry.durationMinutes >= 60 
    ? `${Math.floor(entry.durationMinutes / 60)}h ${entry.durationMinutes % 60}m`
    : `${entry.durationMinutes || '<1'} min`;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] ${
      isAurora 
        ? 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/50' 
        : 'bg-white/80 border border-slate-200/60 hover:border-slate-300/80'
    }`}>
      {/* App Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${catInfo.bgClass}`}>
        {entry.appIcon || catInfo.icon}
      </div>

      {/* App Name & Category */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isAurora ? 'text-white' : 'text-slate-900'}`}>
          {entry.appName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isAurora ? 'text-slate-500' : 'text-slate-400'}`}>
            {catInfo.label}
          </span>
          <span className={`text-[10px] ${isAurora ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
          <span className={`text-[10px] ${isAurora ? 'text-slate-500' : 'text-slate-400'}`}>
            {entry.platform === 'desktop' ? '💻' : '📱'} {entry.platform}
          </span>
        </div>
      </div>

      {/* Time & Duration */}
      <div className="text-right shrink-0">
        <p className={`text-xs font-semibold ${isAurora ? 'text-slate-300' : 'text-slate-700'}`}>
          {duration}
        </p>
        <p className={`text-[10px] ${isAurora ? 'text-slate-500' : 'text-slate-400'}`}>
          {startTime} → {endTime}
        </p>
      </div>

      {/* Category color indicator */}
      <div 
        className="w-1 h-8 rounded-full shrink-0"
        style={{ backgroundColor: catInfo.color + '80' }}
      />
    </div>
  );
}
