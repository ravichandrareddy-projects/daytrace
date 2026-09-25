import React, { useState } from 'react';
import { useApp, CURRENCIES } from '../../context/AppContext';

export default function AddExpenseModal() {
  const { state, addTransaction, setIsAddExpenseOpen, formatMoney } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [type, setType] = useState('expense');

  if (!state.isAddExpenseOpen) return null;

  const activeCurr = CURRENCIES[state.currency] || CURRENCIES.INR;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || !title.trim()) return;

    // Convert input back to base INR if user is entering in non-INR currency
    const amountInINR = (num / activeCurr.rate);

    addTransaction({
      title: title.trim(),
      amountINR: amountInINR,
      category,
      type,
      icon: category === 'Food & Dining' ? 'local_cafe' : category === 'Bills & Subs' ? 'receipt_long' : category === 'Travel & City' ? 'directions_transit' : 'payments'
    });

    setTitle('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Log Transaction</h3>
          </div>
          <button 
            onClick={() => setIsAddExpenseOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Type Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 rounded-lg text-label-md font-bold transition-all ${
                type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 rounded-lg text-label-md font-bold transition-all ${
                type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Vendor / Title</label>
            <input 
              type="text"
              placeholder="e.g. Blue Tokai Coffee / Metro Card"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              Amount ({activeCurr.code} {activeCurr.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">{activeCurr.symbol}</span>
              <input 
                type="number"
                step="any"
                placeholder="150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:border-primary"
            >
              <option value="Food & Dining">Food &amp; Dining</option>
              <option value="Bills & Subs">Bills &amp; Subs</option>
              <option value="Travel & City">Travel &amp; City</option>
              <option value="Study & Books">Study &amp; Books</option>
              <option value="Health & Fitness">Health &amp; Fitness</option>
              <option value="Income">Direct Ingress / Salary</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-on-surface-variant font-label-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-label-md font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20"
            >
              Post to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
