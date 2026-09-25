import React from 'react';
import { getCategoryInfo } from '../../services/AppCategorizer';

/**
 * DistractionBadge — Shows a distraction that occurred during a focus session
 * Displayed at the bottom of the Live Focus card
 */
export default function DistractionBadge({ distraction, isAurora = false }) {
  const catInfo = getCategoryInfo(distraction.category);

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

  const startTime = formatTime(distraction.startTime);
  const endTime = formatTime(distraction.endTime);
  const duration = distraction.durationMinutes >= 60
    ? `${Math.floor(distraction.durationMinutes / 60)}h ${distraction.durationMinutes % 60}m`
    : `${distraction.durationMinutes || '<1'} min distraction`;

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
      isAurora
        ? 'bg-red-500/10 border border-red-500/20'
        : 'bg-red-50/80 border border-red-200/50'
    }`}>
      {/* Icon */}
      <span className="text-base shrink-0">{distraction.appIcon || catInfo.icon}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className={`font-bold ${isAurora ? 'text-red-300' : 'text-red-700'}`}>
          {distraction.appName}
        </span>
        <span className={`ml-2 ${isAurora ? 'text-red-400/60' : 'text-red-400'}`}>
          {startTime} → {endTime}
        </span>
      </div>

      {/* Duration */}
      <span className={`font-semibold shrink-0 ${isAurora ? 'text-red-400/80' : 'text-red-500'}`}>
        {duration}
      </span>
    </div>
  );
}
