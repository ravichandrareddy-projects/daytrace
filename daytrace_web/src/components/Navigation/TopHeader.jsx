import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TopHeader({ title = 'DayTrace', subtitle = 'Active Flow', onOpenReport }) {
  const { setActiveTab, setIsQuickLogOpen, setQuickLogType } = useApp();

  return (
    <header className="sticky top-0 z-30 max-w-md mx-auto px-4 pt-4 pb-3 flex items-center justify-between border-b border-indigo-100/70 backdrop-blur-xl bg-[#FAF8FF]/85">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveTab('today')}
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-[2px] shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px] fill">
              schedule
            </span>
          </div>
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold tracking-wider text-primary uppercase">DayTrace</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 text-indigo-800 border border-indigo-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              {subtitle}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-on-surface tracking-tight leading-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {onOpenReport && (
          <button 
            onClick={onOpenReport}
            className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 shadow-sm flex items-center justify-center text-primary hover:bg-indigo-100 active:scale-90 transition-all"
            title="Share & Print Screen Report"
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
          </button>
        )}

        <button 
          onClick={() => {
            setQuickLogType('activity');
            setIsQuickLogOpen(true);
          }}
          className="w-9 h-9 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:text-primary hover:border-primary/40 active:scale-90 transition-all"
          title="Quick Capture"
        >
          <span className="material-symbols-outlined text-[19px]">add</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-indigo-500/20 shadow-sm hover:ring-primary transition-all active:scale-95"
          title="Settings & Profile"
        >
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
          />
        </button>
      </div>
    </header>
  );
}
