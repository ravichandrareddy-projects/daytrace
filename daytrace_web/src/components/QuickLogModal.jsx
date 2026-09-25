import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../utils/currencies';
import confetti from 'canvas-confetti';

export default function QuickLogModal() {
  const {
    state,
    isQuickLogOpen,
    setIsQuickLogOpen,
    quickLogType,
    setQuickLogType,
    addTransaction,
    addTimelineEvent,
    addMemory,
    addVoiceNote,
    resetSession,
  } = useApp();

  const { currency } = state;
  const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  // Activity Form State
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState('Deep Work');
  const [activityDuration, setActivityDuration] = useState('45');
  const [startTimerNow, setStartTimerNow] = useState(true);

  // Expense Form State
  const [txAmount, setTxAmount] = useState('');
  const [txTitle, setTxTitle] = useState('');
  const [txCategory, setTxCategory] = useState('Dining & Drinks');
  const [txAccount, setTxAccount] = useState('Apple Pay');
  const [txType, setTxType] = useState('expense');

  // Memory Form State
  const [memCaption, setMemCaption] = useState('');
  const [memLocation, setMemLocation] = useState('Manhattan, NY');
  const [memMood, setMemMood] = useState('Flow & Energy');
  const [memImage, setMemImage] = useState('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80');

  // Voice Note State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  if (!isQuickLogOpen) return null;

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    if (startTimerNow) {
      resetSession(activityTitle, activityCategory, parseInt(activityDuration) || 45);
    }

    addTimelineEvent({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${activityDuration}m`,
      title: activityTitle,
      category: activityCategory,
      icon: activityCategory === 'Deep Work' ? 'bolt' : activityCategory === 'Health' ? 'fitness_center' : 'laptop_chromebook',
      color: 'indigo'
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setIsQuickLogOpen(false);
    setActivityTitle('');
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (!amountNum || !txTitle.trim()) return;

    addTransaction({
      title: txTitle,
      category: txCategory,
      amount: txType === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum),
      account: txAccount,
      type: txType,
      icon: txCategory === 'Dining & Drinks' ? 'local_cafe' : txCategory === 'Groceries' ? 'shopping_basket' : txCategory === 'Health & Fitness' ? 'fitness_center' : 'receipt_long'
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setIsQuickLogOpen(false);
    setTxAmount('');
    setTxTitle('');
  };

  const handleSaveMemory = (e) => {
    e.preventDefault();
    if (!memCaption.trim()) return;

    addMemory({
      caption: memCaption,
      location: memLocation,
      mood: memMood,
      image: memImage,
      tags: ['#DayTrace', '#Moment', `#${memMood.split(' ')[0]}`],
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setIsQuickLogOpen(false);
    setMemCaption('');
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      const timer = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
      window.__voiceTimer = timer;
    } else {
      setIsRecording(false);
      clearInterval(window.__voiceTimer);
      addVoiceNote({
        title: `Quick Voice Reflection (${recordingSeconds}s)`,
        duration: `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`,
      });
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      setIsQuickLogOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden max-h-[90vh] flex flex-col animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-3 border-b border-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-[1.5px]">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Quick Log Hub</h2>
              <p className="text-[11px] text-slate-500">Add to your active daily stream</p>
            </div>
          </div>
          <button 
            onClick={() => setIsQuickLogOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Pills */}
        <div className="px-5 pt-3 pb-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'activity', label: 'Activity', icon: 'bolt' },
            { id: 'expense', label: 'Money', icon: 'payments' },
            { id: 'memory', label: 'Memory', icon: 'photo_camera' },
            { id: 'voice', label: 'Voice Note', icon: 'mic' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setQuickLogType(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                quickLogType === tab.id
                  ? 'bg-primary text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto">
          {quickLogType === 'activity' && (
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What are you working on?</label>
                <input 
                  type="text"
                  placeholder="e.g. Design DayTrace Mobile Specs"
                  value={activityTitle}
                  onChange={e => setActivityTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={activityCategory}
                    onChange={e => setActivityCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option>Deep Work</option>
                    <option>Focus Session</option>
                    <option>Health & Sport</option>
                    <option>Reading & Study</option>
                    <option>Creative Design</option>
                    <option>Personal Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Minutes</label>
                  <input 
                    type="number"
                    value={activityDuration}
                    onChange={e => setActivityDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                    min="5"
                    max="300"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={startTimerNow}
                  onChange={e => setStartTimerNow(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <span className="text-xs font-bold text-indigo-900">Set as current active focus session</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-primary text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all"
              >
                Log Activity & Update Timeline
              </button>
            </form>
          )}

          {quickLogType === 'expense' && (
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    txType === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    txType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount ({currentCurrency.code} - {currentCurrency.symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currentCurrency.symbol}</span>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={e => setTxAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-extrabold text-slate-900 focus:bg-white focus:border-primary outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Merchant</label>
                <input 
                  type="text"
                  placeholder="e.g. Blue Bottle Coffee"
                  value={txTitle}
                  onChange={e => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={txCategory}
                    onChange={e => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option>Dining & Drinks</option>
                    <option>Groceries</option>
                    <option>Health & Fitness</option>
                    <option>Tech & Subscriptions</option>
                    <option>Shopping & Gear</option>
                    <option>Travel & Transport</option>
                    <option>Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account</label>
                  <select 
                    value={txAccount}
                    onChange={e => setTxAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option>Apple Pay</option>
                    <option>Chase Sapphire</option>
                    <option>Mercury Wire</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.99] transition-all"
              >
                Log Transaction
              </button>
            </form>
          )}

          {quickLogType === 'memory' && (
            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Memory Reflection & Caption</label>
                <textarea 
                  rows="3"
                  placeholder="Capture how you felt, what stood out, or a breakthrough idea..."
                  value={memCaption}
                  onChange={e => setMemCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input 
                    type="text"
                    value={memLocation}
                    onChange={e => setMemLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mood</label>
                  <input 
                    type="text"
                    value={memMood}
                    onChange={e => setMemMood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
                  ].map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      onClick={() => setMemImage(url)}
                      className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        memImage === url ? 'border-primary ring-2 ring-primary/30 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      alt="Preset option"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 active:scale-[0.99] transition-all"
              >
                Save Visual Memory
              </button>
            </form>
          )}

          {quickLogType === 'voice' && (
            <div className="py-6 flex flex-col items-center justify-center space-y-5 text-center">
              <div className="relative">
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                )}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500 text-white scale-110 shadow-red-500/30' 
                      : 'bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 text-white hover:scale-105 shadow-indigo-500/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[36px]">
                    {isRecording ? 'stop' : 'mic'}
                  </span>
                </button>
              </div>

              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {isRecording ? `Recording... 00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}` : 'Tap to Record Voice Note'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Transcribes and saves instant audio reflections to your daily stream
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
