import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MemoriesPage() {
  const { 
    state, 
    setActiveTab, 
    addMemoryItem, 
    openReportModal, 
    toggleSearchModal,
    addTransaction,
    addScheduleBlock,
    shareScreenText
  } = useApp();

  const handleShareMemory = async () => {
    const res = await shareScreenText('memories');
    if (res.method === 'native') {
      showToast('Shared visual memories!');
    } else {
      showToast('Visual memories plaintext report copied to clipboard!');
    }
  };

  const [filter, setFilter] = useState('all'); // all | receipts | code | highlights
  const [localSearch, setLocalSearch] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Process Simulated File Upload or Quick Capture
  const handleQuickCapture = () => {
    const newDoc = {
      type: 'receipt',
      badge: 'MANUAL CAPTURE // OCR #343',
      title: 'Espresso Bar & Pastry',
      description: 'Scanned via optical trace. Extracted total ₹180.00 with 100% text fidelity.',
      tags: ['#Receipt', '#Food', '#MorningTrace'],
      amountINR: 180.00,
      paymentMode: 'GPay UPI'
    };
    addMemoryItem(newDoc);
    showToast('New screenshot captured and neural OCR processed!');
  };

  // Review Extracted 17 items action
  const handleReviewExtracted = () => {
    // Commit sample batch of extracted items into ledger and timeline
    addTransaction({
      title: 'Blue Tokai Cold Brew (Extracted)',
      amountINR: -220,
      category: 'Food & Dining',
      icon: 'local_cafe'
    });
    addScheduleBlock({
      title: 'Design Critique Extracted',
      time: '04:30 PM',
      durationMinutes: 45,
      category: 'Deep Work',
      subtitle: 'Extracted from Slack capture at 09:12 AM',
      done: true
    });
    setBannerDismissed(true);
    showToast('Extracted 17 items applied to Ledger & Timeline!');
  };

  const { memoryState } = state;
  const items = memoryState.items || [];

  const filteredItems = items.filter(item => {
    if (filter === 'receipts' && item.type !== 'receipt') return false;
    if (filter === 'code' && item.type !== 'architecture' && item.type !== 'code') return false;
    if (filter === 'highlights' && item.type !== 'highlight' && item.type !== 'personal') return false;
    
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchBadge = (item.badge || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchBadge;
    }
    return true;
  });

  return (
    <div className="font-body-md text-body-md text-on-surface flex flex-col min-h-screen relative z-10 bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header (Exact from Visual Memory stitch template with functional controls) */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter-mobile md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={() => setActiveTab('more')}
              aria-label="Back to More"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-primary transition-colors shrink-0 shadow-sm"
              title="Back to More"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
              <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary truncate font-bold">Vault</span>
              <h1 className="font-headline-md text-headline-md text-on-surface truncate font-bold">Memory</h1>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            {/* Share Report */}
            <button 
              onClick={() => openReportModal('memory')}
              aria-label="Share memory report" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>

            {/* Global Search */}
            <button 
              onClick={() => toggleSearchModal(true)}
              aria-label="Search entries" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">search</span>
            </button>

            {/* Profile */}
            <button 
              aria-label="Account profile" 
              className="w-10 h-10 flex items-center justify-center rounded-full p-0.5 cursor-pointer ring-1 ring-slate-200 shadow-sm" 
              onClick={() => setActiveTab('more')}
            >
              <img 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://lh3.googleusercontent.com/aida/AEtjO1VzwA9o3hqy2e3hbz7ob_7fTKcQeqCpL6XsbxQjQklOX6nFHGXeqe3ZgTJtqtwyY4W-1PH8CrM20rOHC6u5Sc-LGt5cxPwgD-TmCyMtXG2Ab6GHo0e2Lph3oyOBzo3dpRHF1mshvrjltdvucS2QkKMEhTIizgsHUQtBlY8CWm1Rv-e0KbLi_lnNZMTM7-zxwHj96e9P1yiKDv-yHEaeqwPZGYQOlYYkRih4gcRxGKOYe4EUqEyI_9JFcQQ";
                }}
              />
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full rainbow-shimmer opacity-75"></div>
      </header>

      {/* Main Visual Memory Stream */}
      <main className="flex flex-col relative w-full pt-6 pb-28 bg-transparent min-h-screen">
        <div className="flex flex-col w-full md:px-10 max-w-[1200px] mx-auto">
          {/* Telemetry & Ambient Header Section */}
          <div className="px-gutter-mobile pt-space-md pb-space-sm flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-label-sm font-label-sm whitespace-nowrap shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                <span>{memoryState.totalItems} Items Indexed</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-label-sm whitespace-nowrap font-bold">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>Auto-OCR Active</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm whitespace-nowrap font-mono tracking-tighter">
                <span>L1 SYNC // OK</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-space-sm mt-1">
              <div className="flex flex-col min-w-0">
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">Visual Memory Hub</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                  Intelligent neural trace of snippets, receipts, &amp; frames
                </p>
              </div>
              <button 
                onClick={handleQuickCapture}
                aria-label="Scan Frame" 
                className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform flex-shrink-0 border border-slate-200/80 hover:bg-slate-50"
                title="Capture & OCR new frame"
              >
                <span className="material-symbols-outlined text-[20px]">document_scanner</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Area */}
          <div className="px-gutter-mobile py-space-xs flex flex-col gap-space-sm">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">search</span>
              <input 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md pl-10 pr-10 py-2.5 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-100" 
                placeholder="Search OCR text, receipts, notes..." 
                type="text"
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar text-label-sm font-label-sm">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1 font-semibold transition-all ${
                  filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${filter === 'all' ? 'bg-on-primary' : 'bg-slate-400'}`}></span>
                <span>All ({items.length})</span>
              </button>
              <button 
                onClick={() => setFilter('receipts')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-all ${
                  filter === 'receipts' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>🧾 Receipts ({items.filter(i => i.type === 'receipt').length})</span>
              </button>
              <button 
                onClick={() => setFilter('code')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-all ${
                  filter === 'code' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>💻 Code &amp; Arch ({items.filter(i => i.type === 'architecture' || i.type === 'code').length})</span>
              </button>
              <button 
                onClick={() => setFilter('highlights')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-all ${
                  filter === 'highlights' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>📖 Highlights ({items.filter(i => i.type === 'highlight' || i.type === 'personal').length})</span>
              </button>
            </div>
          </div>

          {/* Smart Ingress Notification Banner with Rainbow Border Accent */}
          {!bannerDismissed && (
            <div className="px-gutter-mobile my-space-sm">
              <div className="relative p-[1.5px] rounded-2xl rainbow-shimmer shadow-sm">
                <div className="p-3.5 rounded-[14.5px] bg-surface-container-lowest flex flex-col gap-space-sm">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">AI Screenshot Parser</span>
                          <span className="text-[10px] text-outline font-body-sm">• Synced 4m ago</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                          Auto-extracted 12 tasks, 3 payments, and 2 bookmarks from recent captures.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBannerDismissed(true)}
                      aria-label="Dismiss banner" 
                      className="text-outline hover:text-on-surface p-0.5 flex-shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-space-sm pt-1">
                    <button 
                      onClick={handleReviewExtracted}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-label-sm shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1 font-bold"
                    >
                      <span>Review Extracted (17)</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Upload / Add Bar */}
          <div className="px-gutter-mobile mb-3">
            <button
              onClick={handleQuickCapture}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
              + Import Screenshot / Photo to OCR
            </button>
          </div>

          {/* Memories Card Grid */}
          <div className="px-gutter-mobile grid grid-cols-2 gap-3 pb-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="rounded-2xl bg-white shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                    <img 
                      src={item.imageUrl || (item.type === 'receipt' 
                        ? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=80' 
                        : item.type === 'architecture'
                          ? 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&auto=format&fit=crop&q=80')} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/60 text-white backdrop-blur-sm">
                      {item.badge}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] font-bold text-primary block truncate">{item.title}</span>
                    <p className="text-xs text-slate-700 line-clamp-2 mt-0.5 font-medium">{item.description}</p>
                  </div>
                </div>

                <div className="px-2.5 pb-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-50 pt-1.5">
                  <span>{item.time || '10:42 AM'}</span>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">Inspect →</span>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="px-gutter-mobile pb-8">
              <div className="p-8 text-center rounded-2xl bg-white/70 border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">photo_library</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Visual Memories Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Capture screenshots, receipts, or notes to index them into your local vault.
                </p>
                <button
                  type="button"
                  onClick={handleQuickCapture}
                  className="mt-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                  Capture First Memory
                </button>
              </div>
            </div>
          )}

          {/* Bottom Share Button */}
          <div className="px-gutter-mobile pt-2 pb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share Memory &amp; OCR Report</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Export captured frames as text</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handleShareMemory}
                  className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Share
                </button>
                <button 
                  type="button"
                  onClick={() => openReportModal('memory')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                  title="View printable report"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inspect Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-mono font-bold text-indigo-600">{selectedItem.badge}</span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-900">{selectedItem.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedItem.description}</p>
            {selectedItem.tags && (
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedItem.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="pt-3 flex gap-2">
              <button 
                onClick={() => {
                  showToast('Parsed data synced to Daily Timeline');
                  setSelectedItem(null);
                }}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200"
              >
                Link to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
