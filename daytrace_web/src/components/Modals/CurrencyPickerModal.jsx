import React from 'react';
import { useApp, CURRENCIES } from '../../context/AppContext';

export default function CurrencyPickerModal({ isOpen, onClose }) {
  const { state, setCurrency } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Select Currency</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-body-sm text-slate-500">
          All values across Today, Money, and reports will convert automatically.
        </p>

        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {Object.entries(CURRENCIES).map(([code, c]) => {
            const isSelected = state.currency === code;
            return (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm' 
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-body-md">{code}</span>
                  <span className="text-indigo-600 font-bold text-headline-md">{c.symbol}</span>
                </div>
                <span className="text-body-sm text-slate-500 text-[11px] truncate mt-0.5">{c.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-label-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
