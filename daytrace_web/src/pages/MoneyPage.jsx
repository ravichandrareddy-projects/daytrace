import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CurrencyPickerModal from '../components/Modals/CurrencyPickerModal';

export default function MoneyPage() {
  const { 
    state, 
    setActiveTab, 
    formatMoney, 
    confirmIngress, 
    dismissIngress, 
    setIsAddExpenseOpen, 
    openReportModal, 
    toggleSearchModal,
    openLiveActionModal,
    shareScreenText
  } = useApp();

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareMoney = async () => {
    const res = await shareScreenText('money');
    if (res.method === 'native') {
      showToast('Financial report shared!');
    } else {
      showToast('Financial plaintext report copied to clipboard!');
    }
  };

  const { moneyState } = state;

  const percentUtilized = Math.min(100, (moneyState.totalDeployedINR / moneyState.maxCapINR) * 100).toFixed(1);

  return (
    <div className="relative min-h-screen pb-32 overflow-x-hidden text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900 bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}
      {/* App Header (Exact from Money stitch template with functional controls) */}
      <header className="relative z-10 px-5 pt-6 pb-4 flex items-center justify-between border-b border-indigo-50/70 backdrop-blur-md bg-white/75 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
            <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">DayTrace</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 text-indigo-700 border border-indigo-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Active Flow
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Money</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share Report */}
          <button 
            onClick={() => openReportModal('money')}
            aria-label="Share financial report"
            className="w-9 h-9 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
          
          {/* Search */}
          <button 
            onClick={() => toggleSearchModal(true)}
            aria-label="Search transactions"
            className="w-9 h-9 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Profile */}
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-indigo-500/20 shadow-sm cursor-pointer" onClick={() => setActiveTab('more')}>
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://lh3.googleusercontent.com/aida/AEtjO1VzwA9o3hqy2e3hbz7ob_7fTKcQeqCpL6XsbxQjQklOX6nFHGXeqe3ZgTJtqtwyY4W-1PH8CrM20rOHC6u5Sc-LGt5cxPwgD-TmCyMtXG2Ab6GHo0e2Lph3oyOBzo3dpRHF1mshvrjltdvucS2QkKMEhTIizgsHUQtBlY8CWm1Rv-e0KbLi_lnNZMTM7-zxwHj96e9P1yiKDv-yHEaeqwPZGYQOlYYkRih4gcRxGKOYe4EUqEyI_9JFcQQ";
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Scrollable Money Content (Exact from Money stitch template) */}
      <main className="relative z-10 px-5 md:px-10 pt-4 space-y-4 max-w-[1200px] mx-auto">
        {/* Month & Live Sync Status Bar with Currency Switcher */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-indigo-100/70 shadow-sm flex items-center justify-between">
          <div 
            onClick={() => setIsCurrencyModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">September 2026</span>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency Switch Badge */}
            <button 
              onClick={() => setIsCurrencyModalOpen(true)}
              className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              {state.currency} ▾
            </button>

            {/* SYNC LIVE Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              SYNC LIVE
            </div>
          </div>
        </div>

        {/* Monthly Consumption Hero Card */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-indigo-100/80 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.08)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Monthly Consumption</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              {percentUtilized}% utilized
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block -mb-1">Total Deployed</span>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {formatMoney(moneyState.totalDeployedINR)}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                  <polyline points="17 18 23 18 23 12"></polyline>
                </svg>
                <span>{formatMoney(moneyState.paceDifferenceINR, { noDecimals: true })} under projected pace</span>
              </div>
            </div>

            {/* Circular Budget Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                <path className="text-indigo-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${percentUtilized}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
              </svg>
              <div className="absolute text-center">
                <svg className="w-4 h-4 text-indigo-600 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Linear Cap Bar */}
          <div className="mt-2 space-y-1.5">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentUtilized}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{formatMoney(0)}</span>
              <span>Max Cap {formatMoney(moneyState.maxCapINR)}</span>
            </div>
          </div>

          {/* Quick Sub-Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                Today's Flow
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {formatMoney(moneyState.todayFlowINR)}
              </div>
              <span className="text-[10px] text-slate-400">{moneyState.todayFlowCount} micro-transfers</span>
            </div>
            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                Runway Left
              </div>
              <div className="text-base font-extrabold text-indigo-600 mt-0.5">
                {formatMoney(moneyState.runwayLeftINR)}
              </div>
              <span className="text-[10px] text-slate-400">{moneyState.daysLeftInCycle} days left in cycle</span>
            </div>
          </div>
        </div>

        {/* Automated UPI / SMS Ingress Card (PhonePe Ingress) */}
        {moneyState.ingressAlert.visible && (
          <div className="bg-gradient-to-br from-white via-indigo-50/30 to-pink-50/20 backdrop-blur-xl rounded-3xl p-4 border-2 border-indigo-200/80 shadow-[0_8px_25px_-6px_rgba(99,102,241,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                </div>
                <span className="text-xs font-bold text-indigo-700">PhonePe Ingress</span>
                <span className="text-[10px] text-slate-400 font-medium">· {moneyState.ingressAlert.timeAgo}</span>
              </div>
              <button 
                onClick={dismissIngress}
                aria-label="Dismiss alert"
                className="w-6 h-6 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex items-start justify-between py-1">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {moneyState.ingressAlert.vendor}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {moneyState.ingressAlert.note}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900">
                  {formatMoney(moneyState.ingressAlert.amountINR)}
                </div>
                <span className="text-[10px] font-bold text-rose-500 tracking-wider uppercase">DEBIT</span>
              </div>
            </div>

            {/* Smart Attribution Tags */}
            <div className="mt-3 pt-3 border-t border-indigo-100/60 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 flex-1">
                {moneyState.ingressAlert.attributionPills.map((pill, idx) => (
                  <button 
                    key={idx}
                    onClick={() => confirmIngress(pill)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                      idx === 0 
                        ? 'bg-cyan-500 text-white shadow-cyan-200' 
                        : 'bg-white/80 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    <span>{pill}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingress Actions */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button 
                onClick={() => confirmIngress('Food & Dining')}
                className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Confirm as Food
              </button>
              <button 
                onClick={() => openLiveActionModal('note')}
                className="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Note
              </button>
            </div>
          </div>
        )}

        {/* Category Distribution Hero Card */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-indigo-100/80 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[16px]">pie_chart</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Category Distribution</span>
            </div>
            <button 
              onClick={() => setIsAddExpenseOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              + Log Expense
            </button>
          </div>

          {/* Segmented Distribution Bar */}
          {moneyState.totalDeployedINR > 0 ? (
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
              {moneyState.categoryDistribution.filter(c => c.amountINR > 0).map((cat, i) => {
                const pct = Math.max(5, Math.round((cat.amountINR / moneyState.totalDeployedINR) * 100));
                return (
                  <div 
                    key={i} 
                    className={`${cat.color || 'bg-indigo-600'} h-full rounded-sm`} 
                    style={{ width: `${pct}%` }} 
                    title={`${cat.name}: ${pct}%`}
                  ></div>
                );
              })}
            </div>
          ) : (
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-200 rounded-full" style={{ width: '100%' }}></div>
            </div>
          )}

          {/* Category Chips Grid */}
          {moneyState.categoryDistribution.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {moneyState.categoryDistribution.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cat.color || 'bg-indigo-600'}`}></span>
                    <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{formatMoney(cat.amountINR, { noDecimals: true })}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2 mt-2 font-medium">No expenses categorized yet. Ready for your real data.</p>
          )}
        </div>

        {/* Itemized Activity Ledger */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-indigo-100/80 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Activity Ledger</h2>
            </div>
            <button 
              onClick={() => setIsAddExpenseOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Add
            </button>
          </div>

          <div className="space-y-4">
            {moneyState.transactions.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Recent Transactions ({moneyState.transactions.length})</span>
                  <span>Total {formatMoney(moneyState.todayFlowINR)}</span>
                </div>

                {moneyState.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-[18px] text-slate-600">
                          {tx.icon || 'payments'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                        <span className="text-[10px] text-slate-400">{tx.time} · {tx.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-extrabold block ${tx.amountINR < 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {formatMoney(tx.amountINR)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Expenses Recorded Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Start tracking your real finances. Tap '+ Log Expense' to add your first transaction.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  + Add Expense
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Share Button */}
        <div className="pt-2 pb-2">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-violet-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Share Financial Ledger</h4>
                <p className="text-[11px] text-slate-500 font-medium">Export expenses &amp; runway as text</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={handleShareMoney}
                className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">send</span>
                Share
              </button>
              <button 
                type="button"
                onClick={() => openReportModal('money')}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                title="View printable report"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Currency Picker Modal */}
      <CurrencyPickerModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
      />
    </div>
  );
}
