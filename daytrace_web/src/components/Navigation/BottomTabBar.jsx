import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomTabBar() {
  const { state, setActiveTab } = useApp();
  const { activeTab } = state;

  return (
    <nav 
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.04)]"
      data-active-classes="text-primary font-label-md"
    >
      {/* Animated Rainbow Shimmer Line across top of Tab Bar */}
      <div className="h-[2px] w-full rainbow-shimmer opacity-90"></div>

      <div className="h-16 px-gutter-mobile flex items-center justify-around max-w-md mx-auto">
        {/* Today */}
        <button
          onClick={() => setActiveTab('today')}
          aria-label="Today"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-space-xs py-1 transition-colors group ${
            activeTab === 'today'
              ? 'text-primary font-label-md font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-label-sm'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'today' ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
          >
            wb_sunny
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">Today</span>
        </button>

        {/* Timeline */}
        <button
          onClick={() => setActiveTab('timeline')}
          aria-label="Timeline"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-space-xs py-1 transition-colors group ${
            activeTab === 'timeline'
              ? 'text-primary font-label-md font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-label-sm'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'timeline' ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
          >
            schedule
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">Timeline</span>
        </button>

        {/* Money */}
        <button
          onClick={() => setActiveTab('money')}
          aria-label="Money"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-space-xs py-1 transition-colors group ${
            activeTab === 'money'
              ? 'text-primary font-label-md font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-label-sm'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'money' ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
          >
            account_balance_wallet
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">Money</span>
        </button>

        {/* Ideas */}
        <button
          onClick={() => setActiveTab('ideas')}
          aria-label="Ideas"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-space-xs py-1 transition-colors group ${
            activeTab === 'ideas'
              ? 'text-primary font-label-md font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-label-sm'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'ideas' ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
          >
            lightbulb
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">Ideas</span>
        </button>

        {/* More */}
        <button
          onClick={() => setActiveTab('more')}
          aria-label="More"
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-space-xs py-1 transition-colors group ${
            activeTab === 'more' || activeTab === 'settings'
              ? 'text-primary font-label-md font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-label-sm'
          }`}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'more' || activeTab === 'settings' ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
          >
            grid_view
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
}
