import React from 'react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'today', label: 'Today', icon: 'wb_sunny' },
  { id: 'timeline', label: 'Timeline', icon: 'schedule' },
  { id: 'money', label: 'Money', icon: 'account_balance_wallet' },
  { id: 'memories', label: 'Memory', icon: 'auto_awesome' },
  { id: 'ideas', label: 'Ideas', icon: 'lightbulb' },
];

const BOTTOM_ITEMS = [
  { id: 'more', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  const { state, setActiveTab } = useApp();
  const { activeTab } = state;
  const currentTheme = state.settings?.theme || 'aurora';
  const isAurora = currentTheme === 'aurora' || currentTheme === 'aurora_night';
  const isRainbow = currentTheme === 'rainbow';

  return (
    <aside className={`hidden md:flex flex-col w-[220px] min-h-screen fixed left-0 top-0 z-40 border-r transition-all duration-300 ${
      isAurora 
        ? 'bg-slate-950/95 border-emerald-500/20 backdrop-blur-xl' 
        : isRainbow 
        ? 'bg-white/90 border-slate-200/60 backdrop-blur-xl'
        : 'bg-white/95 border-slate-200/50 backdrop-blur-xl'
    }`}>
      {/* Logo / Brand */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg ${
          isAurora ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
          : isRainbow ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}>
          D
        </div>
        <div>
          <h1 className={`text-base font-black tracking-tight ${isAurora ? 'text-white' : 'text-slate-900'}`}>
            DayTrace
          </h1>
          <p className={`text-[10px] font-semibold tracking-wider uppercase ${isAurora ? 'text-emerald-400/70' : 'text-slate-400'}`}>
            Desktop
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className={`mx-4 h-px ${isAurora ? 'bg-emerald-500/15' : 'bg-slate-200/60'}`} />

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? isAurora 
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10'
                    : isRainbow
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                    : 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : isAurora
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${
                  isAurora ? 'bg-emerald-400' : 'bg-indigo-500'
                }`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`mx-4 h-px ${isAurora ? 'bg-emerald-500/15' : 'bg-slate-200/60'}`} />
      <div className="px-3 py-3 space-y-1">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = activeTab === item.id || activeTab === 'settings';
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? isAurora 
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-indigo-50 text-indigo-600'
                  : isAurora
                    ? 'text-slate-500 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sync Status */}
      <div className={`mx-4 mb-4 p-3 rounded-xl text-xs ${
        isAurora ? 'bg-emerald-500/10 text-emerald-400/80' : 'bg-slate-50 text-slate-500'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Local Mode</span>
        </div>
        <p className="mt-1 opacity-70">All data stored locally</p>
      </div>
    </aside>
  );
}
