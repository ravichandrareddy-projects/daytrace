import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function GlobalSearchModal() {
  const { state, toggleSearchModal, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  if (!state.isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search across schedule blocks, ledger, memories
  const matchingBlocks = q ? state.scheduleBlocks.filter(b => 
    b.title.toLowerCase().includes(q) || (b.subtitle && b.subtitle.toLowerCase().includes(q)) || b.category.toLowerCase().includes(q)
  ) : [];

  const matchingTxs = q ? state.moneyState.transactions.filter(t => 
    t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
  ) : [];

  const matchingMemories = q ? state.memoryState.items.filter(m => 
    m.title.toLowerCase().includes(q) || (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
  ) : [];

  const hasResults = matchingBlocks.length > 0 || matchingTxs.length > 0 || matchingMemories.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm p-4 pt-12 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 p-4 shadow-2xl space-y-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200/80">
          <span className="material-symbols-outlined text-[20px] text-slate-400">search</span>
          <input 
            type="text" 
            autoFocus
            placeholder="Search blocks, expenses, memories..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-body-md text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
          <button onClick={() => toggleSearchModal(false)} className="text-body-sm font-semibold text-primary ml-1">
            Cancel
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
          {!q && (
            <div className="py-6 text-center text-slate-400 text-body-sm">
              Type to search across your schedule, financial ledger, and memory trace.
            </div>
          )}

          {q && !hasResults && (
            <div className="py-6 text-center text-slate-400 text-body-sm">
              No matching entries found for "{query}".
            </div>
          )}

          {matchingBlocks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Schedule &amp; Rhythm</span>
              <div className="space-y-1.5">
                {matchingBlocks.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => {
                      toggleSearchModal(false);
                      setActiveTab('today');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <span className="text-body-md font-semibold text-slate-800 block">{b.title}</span>
                      <span className="text-[11px] text-slate-500">{b.time} · {b.category}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingTxs.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Financial Ledger</span>
              <div className="space-y-1.5">
                {matchingTxs.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => {
                      toggleSearchModal(false);
                      setActiveTab('money');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <span className="text-body-md font-semibold text-slate-800 block">{t.title}</span>
                      <span className="text-[11px] text-slate-500">{t.time} · {t.category}</span>
                    </div>
                    <span className="font-bold text-slate-800 text-body-md">{t.amountINR < 0 ? `-₹${Math.abs(t.amountINR)}` : `+₹${t.amountINR}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingMemories.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Visual Memories</span>
              <div className="space-y-1.5">
                {matchingMemories.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => {
                      toggleSearchModal(false);
                      setActiveTab('memories');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <span className="text-body-md font-semibold text-slate-800 block">{m.title}</span>
                      <span className="text-[11px] text-slate-500">{m.badge} · {m.time}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
