import React, { useState } from 'react';
import { useApp, CURRENCIES } from '../context/AppContext';
import CurrencyPickerModal from '../components/Modals/CurrencyPickerModal';

export default function SettingsPage() {
  const { 
    state, 
    setActiveTab, 
    setCurrency, 
    setTheme, 
    toggleGpuShimmer, 
    toggleDaemon, 
    exportVaultJson, 
    exportVaultMarkdown, 
    openReportModal, 
    toggleSearchModal,
    resetAllData,
    shareScreenText,
    updateUserProfile
  } = useApp();

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTier, setFormTier] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareSettings = async () => {
    const res = await shareScreenText('settings');
    if (res.method === 'native') {
      showToast('Shared system telemetry!');
    } else {
      showToast('System telemetry plaintext copied to clipboard!');
    }
  };

  const { settings } = state;

  return (
    <div className="text-slate-900 font-body-md text-body-md flex flex-col min-h-screen relative z-10 bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Currency Picker Modal */}
      <CurrencyPickerModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
      />

      {/* Header (Exact from More Settings stitch template) */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#FAF9FE]/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
              <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-indigo-600 uppercase tracking-wider truncate">DayTrace</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-purple-300/40 text-purple-700 font-['JetBrains_Mono'] text-[10px] font-medium">
                  ✨ Rainbow Flow
                </span>
              </div>
              <h1 className="text-[17px] font-bold text-slate-900 truncate">More &amp; Settings</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Share Report */}
            <button 
              onClick={() => openReportModal('today')}
              aria-label="Share telemetry report" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-slate-600 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>

            {/* Global Search */}
            <button 
              onClick={() => toggleSearchModal(true)}
              aria-label="Search" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-slate-600 hover:text-indigo-600 transition-colors shadow-sm" 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full ring-2 ring-indigo-500/30 p-0.5">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://lh3.googleusercontent.com/aida/AEtjO1VzwA9o3hqy2e3hbz7ob_7fTKcQeqCpL6XsbxQjQklOX6nFHGXeqe3ZgTJtqtwyY4W-1PH8CrM20rOHC6u5Sc-LGt5cxPwgD-TmCyMtXG2Ab6GHo0e2Lph3oyOBzo3dpRHF1mshvrjltdvucS2QkKMEhTIizgsHUQtBlY8CWm1Rv-e0KbLi_lnNZMTM7-zxwHj96e9P1yiKDv-yHEaeqwPZGYQOlYYkRih4gcRxGKOYe4EUqEyI_9JFcQQ";
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Settings Content */}
      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-transparent flex-1 text-slate-900">
        <div className="flex flex-col w-full gap-4 pb-6 pt-3">
          
          {/* Identity Card with Animated Rainbow Shimmer Perimeter */}
          <div className="relative overflow-hidden rounded-2xl bg-white/85 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(99,102,241,0.08)] border border-slate-200/80 animated-border-shimmer p-[2px]">
            <div className="bg-white rounded-[14px] p-4 relative">
              <div className="relative flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img 
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                    alt="Arjun Mehta"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://lh3.googleusercontent.com/aida/AEtjO1VzwA9o3hqy2e3hbz7ob_7fTKcQeqCpL6XsbxQjQklOX6nFHGXeqe3ZgTJtqtwyY4W-1PH8CrM20rOHC6u5Sc-LGt5cxPwgD-TmCyMtXG2Ab6GHo0e2Lph3oyOBzo3dpRHF1mshvrjltdvucS2QkKMEhTIizgsHUQtBlY8CWm1Rv-e0KbLi_lnNZMTM7-zxwHj96e9P1yiKDv-yHEaeqwPZGYQOlYYkRih4gcRxGKOYe4EUqEyI_9JFcQQ";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-[17px] font-bold text-slate-900 truncate">{settings.userName}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/15 border border-indigo-200 text-indigo-700 font-mono text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      {settings.tier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-mono text-[11px] font-medium text-emerald-600">Sync Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormName(settings.userName);
                        setFormEmail(settings.userEmail);
                        setFormTier(settings.tier);
                        setIsEditProfileOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Configuration Card */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-indigo-600">currency_exchange</span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-600">Active Currency Engine</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                8 Currencies
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {CURRENCIES[state.currency]?.symbol || '₹'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {CURRENCIES[state.currency]?.name} ({state.currency})
                  </h4>
                  <p className="text-xs text-slate-500">Live conversion enabled across all tabs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCurrencyModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Switch ▾
              </button>
            </div>
          </section>

          {/* Visual Memories & OCR Vault (Moved to More) */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-purple-600">auto_awesome</span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-purple-600">Visual Memory // OCR Vault</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                {state.memoryState?.items?.length || 0} Frames
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('memories')}
              className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Visual Memories &amp; Receipts
                  </h4>
                  <p className="text-xs text-slate-500">Scan frames, view optical OCR traces and notes</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('memories');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-1"
              >
                Open Vault →
              </button>
            </div>
          </section>

          {/* Theme Engine Section */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">palette</span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Theme Engine // Visual Architecture</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/60">
                {settings.theme === 'aurora' ? 'OLED Aurora' : 
                 settings.theme === 'plain_black' ? 'Plain Black' : 
                 settings.theme === 'plain_white' ? 'Plain White' : 
                 settings.theme === 'rainbow' ? 'Rainbow White' : 'Polar White'}
              </span>
            </div>

            {/* Active Theme Showcase Card */}
            <div className={`relative rounded-2xl overflow-hidden p-4 transition-all duration-300 ${
              settings.theme === 'aurora'
                ? 'bg-slate-950/90 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.22)]'
                : settings.theme === 'plain_black'
                ? 'bg-black border-2 border-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
                : settings.theme === 'plain_white'
                ? 'bg-white border-2 border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
                : 'bg-white/90 border border-slate-200/90 shadow-[0_4px_18px_rgba(15,23,42,0.06)]'
            }`}>
              {/* Background gradient hint */}
              <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                settings.theme === 'aurora'
                  ? 'opacity-30 bg-gradient-to-tr from-emerald-950 via-slate-950 to-cyan-950'
                  : settings.theme === 'plain_black'
                  ? 'opacity-0'
                  : settings.theme === 'plain_white'
                  ? 'opacity-0'
                  : 'opacity-40 bg-gradient-to-tr from-pink-100 via-purple-100 to-cyan-100'
              }`}></div>

              <div className="relative flex flex-col gap-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        settings.theme === 'aurora' ? 'bg-emerald-400 animate-ping' : 
                        settings.theme === 'plain_black' ? 'bg-white' : 
                        settings.theme === 'plain_white' ? 'bg-slate-900' : 'bg-gradient-to-r from-pink-500 to-indigo-500 animate-ping'
                      }`}></span>
                      <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                        settings.theme === 'aurora' ? 'text-emerald-400' : 
                        settings.theme === 'plain_black' ? 'text-slate-300' : 
                        settings.theme === 'plain_white' ? 'text-slate-700' : 'text-purple-700'
                      }`}>
                        {settings.theme === 'aurora' ? 'Active Aurora · Northern Lights' : 
                         settings.theme === 'plain_black' ? 'Active OLED · Minimal Plain Dark' : 
                         settings.theme === 'plain_white' ? 'Active Minimal · Clean Slate White' : 'Active Aura · Rainbow'}
                      </span>
                    </div>
                    <h3 className={`text-[17px] font-bold mt-1 ${
                      settings.theme === 'aurora' || settings.theme === 'plain_black' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {settings.theme === 'aurora' ? 'Aurora Black Flow' : 
                       settings.theme === 'plain_black' ? 'Plain Black UI' : 
                       settings.theme === 'plain_white' ? 'Plain White UI' : 
                       settings.theme === 'rainbow' ? 'Rainbow White Flow' : 'Polar White'}
                    </h3>
                    <p className={`text-[13px] mt-0.5 leading-relaxed ${
                      settings.theme === 'aurora' || settings.theme === 'plain_black' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {settings.theme === 'aurora'
                        ? 'Deep cosmic OLED black canvas with emerald, cyan & violet aurora shimmering borders.'
                        : settings.theme === 'plain_black'
                        ? 'Ultra-minimal pure pitch black OLED canvas with subtle slate borders and zero glowing effects.'
                        : settings.theme === 'plain_white'
                        ? 'Crisp, distraction-free neutral white canvas with slate typography and zero rainbow shimmer.'
                        : 'Crisp porcelain canvas with prismatic GPU perimeter shimmer.'}
                    </p>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                    settings.theme === 'aurora'
                      ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-emerald-500/40'
                      : settings.theme === 'plain_black'
                      ? 'bg-white text-black shadow-white/20'
                      : settings.theme === 'plain_white'
                      ? 'bg-slate-900 text-white shadow-slate-900/20'
                      : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-500/40'
                  }`}>
                    <span className="material-symbols-outlined text-[17px]">check</span>
                  </div>
                </div>

                {/* Visualizer Preview Bar */}
                <div className={`h-12 w-full rounded-xl p-1.5 flex items-center gap-2 border ${
                  settings.theme === 'aurora'
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : settings.theme === 'plain_black'
                    ? 'bg-neutral-900 border-neutral-700'
                    : 'bg-slate-50 border-slate-200/70'
                }`}>
                  <div className={`h-full flex-1 rounded-lg flex items-center justify-center shadow-sm ${
                    settings.theme === 'aurora' ? 'animated-aurora-border' : 
                    settings.theme === 'plain_black' ? 'bg-black border border-neutral-700 text-white' : 
                    settings.theme === 'plain_white' ? 'bg-white border border-slate-300 text-slate-900' : 'animated-border-shimmer'
                  }`}>
                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
                      {settings.theme === 'aurora' ? 'Aurora Glow' : 
                       settings.theme === 'plain_black' ? 'Pitch Black' : 
                       settings.theme === 'plain_white' ? 'Pure White' : 'Rainbow Glow'}
                    </span>
                  </div>
                  <div className={`h-full flex-1 rounded-lg flex items-center justify-center shadow-sm border ${
                    settings.theme === 'aurora' 
                      ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' 
                      : settings.theme === 'plain_black'
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      : settings.theme === 'plain_white'
                      ? 'bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-900'
                  }`}>
                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
                      {settings.theme === 'aurora' ? 'OLED Black Void' : 
                       settings.theme === 'plain_black' ? 'OLED Minimal' : 
                       settings.theme === 'plain_white' ? 'Clean Slate' : 'Porcelain Core'}
                    </span>
                  </div>
                  <button 
                    onClick={toggleGpuShimmer}
                    className={`h-full px-2.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-colors ${
                      settings.gpuShimmer 
                        ? (settings.theme === 'aurora' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 
                           settings.theme === 'plain_black' ? 'bg-neutral-200 text-black border-white' : 
                           settings.theme === 'plain_white' ? 'bg-slate-900 text-white border-slate-800' : 'bg-indigo-600 text-white border-indigo-600')
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Toggle GPU Shimmer"
                  >
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    GPU: {settings.gpuShimmer ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Selector Grid - 5 Distinct Themes */}
            <div className="flex flex-col gap-2 pt-0.5">
              {/* Row 1: The Dark UIs */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Aurora Black */}
                <button 
                  id="btn-theme-aurora"
                  onClick={() => {
                    setTheme('aurora');
                    showToast('Aurora Black with glowing borders active ✨');
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                    settings.theme === 'aurora' || settings.theme === 'aurora_night'
                      ? 'bg-slate-950 border-2 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.35)]' 
                      : 'bg-slate-900/60 border border-slate-700/80 hover:border-emerald-500/40'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 shadow-sm shadow-emerald-400/50"></div>
                    <span className={`material-symbols-outlined text-[17px] ${
                      settings.theme === 'aurora' || settings.theme === 'aurora_night'
                        ? 'text-emerald-400 font-bold' 
                        : 'text-slate-500'
                    }`}>
                      {settings.theme === 'aurora' || settings.theme === 'aurora_night' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-white truncate">Aurora Black</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold truncate">Black + Borders</span>
                </button>

                {/* 2. Plain Black (NEW) */}
                <button 
                  id="btn-theme-plain-black"
                  onClick={() => {
                    setTheme('plain_black');
                    showToast('Plain Black minimal UI active 🌑');
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                    settings.theme === 'plain_black'
                      ? 'bg-black border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.25)] text-white' 
                      : 'bg-black/90 border border-neutral-800 hover:border-neutral-600 text-neutral-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-neutral-100 border border-neutral-400"></div>
                    <span className={`material-symbols-outlined text-[17px] ${settings.theme === 'plain_black' ? 'text-white font-bold' : 'text-neutral-600'}`}>
                      {settings.theme === 'plain_black' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold truncate">Plain Black</span>
                  <span className="font-mono text-[10px] text-neutral-400 font-medium truncate">Pure OLED Minimal</span>
                </button>
              </div>

              {/* Row 2: The Light UIs */}
              <div className="grid grid-cols-3 gap-2">
                {/* 3. Plain White (NEW) */}
                <button 
                  id="btn-theme-plain-white"
                  onClick={() => {
                    setTheme('plain_white');
                    showToast('Plain White minimal UI active ⚪');
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                    settings.theme === 'plain_white'
                      ? 'bg-white border-2 border-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.15)] text-slate-900' 
                      : 'bg-slate-900/40 border border-slate-700/60 hover:border-slate-500 text-slate-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-white border border-slate-400"></div>
                    <span className={`material-symbols-outlined text-[17px] ${settings.theme === 'plain_white' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {settings.theme === 'plain_white' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold truncate">Plain White</span>
                  <span className="font-mono text-[10px] text-slate-500 font-medium truncate">Clean Slate</span>
                </button>

                {/* 4. Rainbow White */}
                <button 
                  id="btn-theme-rainbow"
                  onClick={() => {
                    setTheme('rainbow');
                    showToast('Rainbow Shimmer active 🌈');
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                    settings.theme === 'rainbow' 
                      ? 'bg-white border-2 border-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.15)] text-slate-900' 
                      : 'bg-slate-900/40 border border-slate-700/60 hover:border-slate-500 text-slate-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-sm"></div>
                    <span className={`material-symbols-outlined text-[17px] ${settings.theme === 'rainbow' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                      {settings.theme === 'rainbow' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold truncate">Rainbow</span>
                  <span className="font-mono text-[10px] text-indigo-400 font-medium truncate">White Prism</span>
                </button>

                {/* 5. Aurora White / Polar */}
                <button 
                  id="btn-theme-aurora-white"
                  onClick={() => {
                    setTheme('aurora_white');
                    showToast('Polar White active ❄️');
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                    settings.theme === 'aurora_white' 
                      ? 'bg-white border-2 border-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.15)] text-slate-900' 
                      : 'bg-slate-900/40 border border-slate-700/60 hover:border-slate-500 text-slate-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-300"></div>
                    <span className={`material-symbols-outlined text-[17px] ${settings.theme === 'aurora_white' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                      {settings.theme === 'aurora_white' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold truncate">Polar</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate">Pure White</span>
                </button>
              </div>
            </div>
          </section>

          {/* Telemetry Daemons Section */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Telemetry &amp; Sensor Daemons</span>
              <span className="font-mono text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                {Object.values(settings.daemons).filter(Boolean).length} Running
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden border border-slate-200 divide-y divide-slate-100 shadow-sm">
              {/* SMS Parser Daemon */}
              <div 
                onClick={() => {
                  toggleDaemon('smsParser');
                  showToast(`SMS Parser ${!settings.daemons.smsParser ? 'enabled' : 'paused'}`);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-slate-900 truncate">Automated SMS Parser</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${settings.daemons.smsParser ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <span className="text-[12px] text-slate-500 truncate">PhonePe, GPay, HDFC Banking feeds</span>
                  </div>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  settings.daemons.smsParser 
                    ? 'text-emerald-700 bg-emerald-100/70 border border-emerald-300/60' 
                    : 'text-slate-500 bg-slate-100 border border-slate-200'
                }`}>
                  {settings.daemons.smsParser ? 'ONLINE' : 'PAUSED'}
                </span>
              </div>

              {/* Screen Time Daemon */}
              <div 
                onClick={() => {
                  toggleDaemon('screenTime');
                  showToast(`Screen Time sensor ${!settings.daemons.screenTime ? 'linked' : 'unlinked'}`);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-slate-900 truncate">Screen Time &amp; HealthKit</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${settings.daemons.screenTime ? 'bg-purple-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <span className="text-[12px] text-slate-500 truncate">Biometrics, Sleep stages, Focus sessions</span>
                  </div>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  settings.daemons.screenTime 
                    ? 'text-purple-700 bg-purple-100/70 border border-purple-300/60' 
                    : 'text-slate-500 bg-slate-100 border border-slate-200'
                }`}>
                  {settings.daemons.screenTime ? 'LINKED' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </section>

          {/* Security & Ledger Integrity Card */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Security &amp; Ledger Integrity</span>
            </div>
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-4 flex flex-col gap-3.5 border border-slate-200/90 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-slate-900">Local-First Encrypted Vault</span>
                  <span className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">Zero raw telemetry leaves this device. Master key protected by Secure Enclave.</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button 
                  onClick={() => {
                    exportVaultJson();
                    showToast('Vault JSON export triggered!');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors text-[13px] font-semibold shadow-sm active:scale-95" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-indigo-600">download</span>
                  Export JSON
                </button>
                <button 
                  onClick={() => {
                    exportVaultMarkdown();
                    showToast('Markdown telemetry export downloaded!');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors text-[13px] font-semibold shadow-sm active:scale-95" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-purple-600">description</span>
                  Markdown Pack
                </button>
              </div>

              {/* Maintenance Tools */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => showToast('Pipeline cache cleared successfully.')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Flush Pipeline Cache
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Reset all DayTrace demo data back to defaults?')) {
                      resetAllData();
                      showToast('Vault restored to defaults.');
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  Reset Vault Data
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Share Button */}
          <div className="pt-2 pb-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share Telemetry &amp; Config</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Export system status &amp; daemons as text</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handleShareSettings}
                  className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Share
                </button>
                <button 
                  type="button"
                  onClick={() => openReportModal('today')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                  title="View report"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
              </div>
            </div>
          </div>

          {/* App Info Footer */}
          <footer className="flex flex-col items-center justify-center text-center gap-1 pt-2 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500"></span>
              <span className="font-mono text-[11px] font-semibold uppercase text-slate-600 tracking-wider">DayTrace Mobile OS // Engine v3</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">v2.4.1 (Rainbow Flow Build 2026.09-White)</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Sculpted for high-agency intentional routines.</span>
          </footer>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit User Profile</h3>
                  <p className="text-[11px] text-slate-400">Updates sync to all screens &amp; reports</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateUserProfile({
                  userName: formName,
                  userEmail: formEmail,
                  tier: formTier
                });
                setIsEditProfileOpen(false);
                showToast(`Profile updated for ${formName || 'User'}!`);
              }}
              className="space-y-3 pt-1"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input 
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Alex, Arjun, Sarah"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                <input 
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@daytrace.local"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Profile Tier / Title</label>
                <input 
                  type="text"
                  value={formTier}
                  onChange={(e) => setFormTier(e.target.value)}
                  placeholder="e.g. PRO TIER, BUILDER, STUDENT"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
