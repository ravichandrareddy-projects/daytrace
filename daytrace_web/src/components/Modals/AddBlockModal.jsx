import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddBlockModal() {
  const { state, addScheduleBlock, setIsAddBlockOpen } = useApp();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('45');
  const [category, setCategory] = useState('Deep Work');
  const [subtitle, setSubtitle] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!state.isAddBlockOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addScheduleBlock({
      title: title.trim(),
      time,
      durationMinutes: duration,
      category,
      subtitle: subtitle.trim() || (isDone ? 'Completed recorded activity' : 'Custom logged session'),
      categoryTag: category.toUpperCase(),
      done: isDone,
      icon: category === 'Habit' ? 'check' : category === 'Nutrition' ? 'restaurant' : category === 'Deep Work' ? 'terminal' : 'schedule'
    });
    setTitle('');
    setSubtitle('');
    setIsDone(false);
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
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Add Time Block</h3>
          </div>
          <button 
            onClick={() => setIsAddBlockOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode switcher: Planned vs What I Did (Recorded) */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setIsDone(false)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isDone ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Planned Block
          </button>
          <button
            type="button"
            onClick={() => setIsDone(true)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              isDone ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            What I Done (Recorded)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Activity Title</label>
            <input 
              type="text"
              placeholder={isDone ? "e.g. Completed Code Review & PR #41" : "e.g. Flutter Architecture Review"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Time Slot</label>
              <input 
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 - 11:30 AM"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Duration (Minutes)</label>
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="5"
                max="360"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Category Tag</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:border-primary"
            >
              <option value="Deep Work">Deep Work</option>
              <option value="Study // Code">Study // Code</option>
              <option value="Habit">Habit</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Work">Work</option>
              <option value="Rest">Rest</option>
              <option value="Personal">Personal</option>
              <option value="Prep">Prep</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Deliverable Note</label>
            <input 
              type="text"
              placeholder="e.g. Implement cache invalidation pipeline"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-slate-200/80 text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddBlockOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-on-surface-variant font-label-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-white font-label-md font-bold active:scale-95 transition-all shadow-md ${
                isDone 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                  : 'bg-primary hover:bg-primary-container shadow-primary/20'
              }`}
            >
              {isDone ? 'Record What I Done' : 'Save to Rhythm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
