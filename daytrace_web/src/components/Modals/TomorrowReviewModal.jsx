import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function TomorrowReviewModal() {
  const { state, setIsReviewCutoffOpen, addScheduleBlock } = useApp();
  const [taskInput, setTaskInput] = useState('');
  const [tomorrowTasks, setTomorrowTasks] = useState([
    { id: 'tm1', time: '08:30 AM', title: 'System Architecture Spec (Part 2)', done: false },
    { id: 'tm2', time: '11:00 AM', title: 'Capacitor Android Native Bridge Sync', done: false },
    { id: 'tm3', time: '03:30 PM', title: 'Ledger Encryption Unit Verification', done: false }
  ]);

  if (!state.isReviewCutoffOpen) return null;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTomorrowTasks(prev => [
      ...prev,
      { id: 'tm_' + Date.now(), time: '02:00 PM', title: taskInput.trim(), done: false }
    ]);
    setTaskInput('');
  };

  const handleToggle = (id) => {
    setTomorrowTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleConfirmSchedule = () => {
    // Commit into tomorrow's rhythm
    setIsReviewCutoffOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Tomorrow's Planning</h3>
              <span className="text-[11px] text-on-surface-variant font-medium">Cutoff closes at 11:30 PM tonight</span>
            </div>
          </div>
          <button 
            onClick={() => setIsReviewCutoffOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-label-sm font-bold uppercase tracking-wider text-slate-400">Planned Anchors</span>
          {tomorrowTasks.map(t => (
            <div 
              key={t.id}
              onClick={() => handleToggle(t.id)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-[20px] ${t.done ? 'text-secondary' : 'text-slate-300'}`}>
                  {t.done ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={`text-body-md ${t.done ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                  {t.title}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{t.time}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text"
            placeholder="Add priority anchor for tomorrow..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-body-md focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-primary text-white font-bold text-label-md hover:bg-primary-container"
          >
            Add
          </button>
        </form>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setIsReviewCutoffOpen(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-label-md"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleConfirmSchedule}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white font-label-md font-bold hover:bg-primary-container shadow-md shadow-primary/20"
          >
            Confirm &amp; Lock
          </button>
        </div>
      </div>
    </div>
  );
}
