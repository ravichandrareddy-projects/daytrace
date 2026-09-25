import React, { useState } from 'react';
import { useApp, getTodayDateKey, formatDisplayDate, shiftDateKey } from '../context/AppContext';

export default function TimelinePage() {
  const { 
    state, 
    setSelectedDate,
    setActiveTab, 
    openReportModal, 
    toggleSearchModal,
    addHourlyLog,
    editHourlyLog,
    deleteHourlyLog,
    shareScreenText
  } = useApp();

  const { hourlyLogs = [], liveFocus } = state;

  const [filterMode, setFilterMode] = useState('all'); // all | done | active
  const [isAddHourModalOpen, setIsAddHourModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const currentDateKey = state.selectedDate || getTodayDateKey();
  const isCurrentToday = currentDateKey === getTodayDateKey();
  const currentDate = formatDisplayDate(currentDateKey);

  const handlePrevDay = () => {
    setSelectedDate(shiftDateKey(currentDateKey, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(shiftDateKey(currentDateKey, 1));
  };

  const handleJumpToday = () => {
    setSelectedDate(getTodayDateKey());
  };

  // New Log Form State
  const [newSlot, setNewSlot] = useState('04:00 - 05:00 PM');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('60');
  const [newCategory, setNewCategory] = useState('Deep Work');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const totalDurationMins = hourlyLogs.reduce((acc, h) => acc + (h.durationMinutes || 60), 0);
  const recordedMins = hourlyLogs.reduce((acc, h) => acc + (h.done ? (h.durationMinutes || 60) : 0), 0);
  const plannedHours = Math.floor(totalDurationMins / 60);
  const plannedMins = totalDurationMins % 60;
  const recHours = Math.floor(recordedMins / 60);
  const recMins = recordedMins % 60;
  const alignmentPercent = totalDurationMins > 0 ? Math.min(100, Math.round((recordedMins / totalDurationMins) * 100)) : 0;

  // Filter hourly logs
  const filteredLogs = hourlyLogs.filter(hl => {
    if (filterMode === 'done') return hl.done;
    if (filterMode === 'active') return hl.isActive || !hl.done;
    return true;
  });

  const handleCreateHour = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHourlyLog({
      hourSlot: newSlot,
      time: newSlot.split('-')[0].trim(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Work session completed.',
      category: newCategory,
      durationMinutes: newDuration,
      done: true,
      tag: 'RECORDED'
    });
    setNewTitle('');
    setNewDesc('');
    setIsAddHourModalOpen(false);
    showToast('New hourly log recorded!');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLog || !editingLog.title.trim()) return;
    editHourlyLog(editingLog.id, {
      hourSlot: editingLog.hourSlot,
      title: editingLog.title.trim(),
      description: editingLog.description || '',
      category: editingLog.category,
      durationMinutes: parseInt(editingLog.durationMinutes || 60, 10)
    });
    setEditingLog(null);
    showToast('Hourly log updated!');
  };

  const handleShareScreen = async () => {
    const res = await shareScreenText('timeline');
    if (res.method === 'native') {
      showToast('Shared via device sheet!');
    } else {
      showToast('Plaintext hourly log copied to clipboard!');
    }
  };

  return (
    <div className="font-body-md text-body-md text-on-surface flex flex-col min-h-screen relative z-10 bg-transparent pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
              <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary truncate font-bold">Hourly Activity</span>
              <h1 className="font-headline-md text-headline-md text-on-surface truncate font-bold">What I Done</h1>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            {/* Share Report */}
            <button 
              onClick={() => openReportModal('timeline')}
              aria-label="Share timeline report" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
            
            {/* Search */}
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

      {/* Main Stream Content */}
      <main className="flex flex-col relative w-full pt-20 bg-transparent min-h-screen">
        <div className="flex flex-col w-full px-gutter-mobile space-y-space-md max-w-md mx-auto">
          
          {/* Date Stepper */}
          <section className="flex flex-col w-full space-y-space-sm pt-space-xs">
            <div className="flex items-center justify-between bg-surface-container-lowest shadow-sm rounded-xl p-space-xs border border-slate-100">
              <button 
                onClick={handlePrevDay}
                aria-label="Previous day" 
                className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                title="Previous day"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-space-xs cursor-pointer" onClick={handleJumpToday} title={isCurrentToday ? 'Current Day' : 'Click to jump to Today'}>
                <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">{currentDate}</span>
                {isCurrentToday ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary uppercase">Today</span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 hover:bg-primary/20 hover:text-primary transition-colors">Jump Today</span>
                )}
              </div>
              <button 
                onClick={handleNextDay}
                aria-label="Next day" 
                className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                title="Next day"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-space-xs">
              <div className="flex bg-surface-container-high rounded-full p-0.5 border border-slate-200/50">
                <button 
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md font-semibold transition-all ${
                    filterMode === 'all'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  All Hours ({hourlyLogs.length})
                </button>
                <button 
                  onClick={() => setFilterMode('done')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-all ${
                    filterMode === 'done'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Completed ({hourlyLogs.filter(h => h.done).length})
                </button>
              </div>

              <button 
                onClick={() => setIsAddHourModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Log Hour
              </button>
            </div>
          </section>

          {/* Temporal Drift Matrix Card */}
          <section className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm overflow-hidden border border-slate-100">
            <div className="absolute top-0 left-0 right-0 h-1 rainbow-shimmer opacity-80"></div>
            <div className="flex items-center justify-between mb-space-sm pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">dynamic_form</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                  Hourly Recording Matrix
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-fixed-variant">
                {alignmentPercent}% Recorded
              </span>
            </div>

            {/* Dual Metrics */}
            <div className="grid grid-cols-2 gap-space-sm mb-space-sm">
              <div className="bg-surface-container-low rounded-lg p-2.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Total Horizon</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">{plannedHours}h {plannedMins}m</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">Logged Span</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Actual Logged</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">{recHours}h {recMins}m</span>
                <span className="font-label-sm text-label-sm text-secondary block mt-0.5">Done &amp; Active</span>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
                <span>Pacing: {recHours}h {recMins}m / {plannedHours}h {plannedMins}m</span>
                <span>{alignmentPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(5, alignmentPercent)}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Quick Action Bar: Add Hourly Log / Column */}
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">more_time</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">What Did You Do This Hour?</h4>
                <p className="text-[10px] text-slate-400">Add or edit column for any time of day</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddHourModalOpen(true)}
              className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">add_circle</span>
              + Add Hour
            </button>
          </div>

          {/* ========================================================= */}
          {/* HOURLY STREAM CARDS ("What I Have Done Every Hour") */}
          {/* ========================================================= */}
          <div className="space-y-3">
            {filteredLogs.map((hl) => {
              const isDone = hl.done;
              const isActive = hl.isActive;

              return (
                <div 
                  key={hl.id}
                  className={`p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border transition-all shadow-sm relative overflow-hidden ${
                    isActive 
                      ? 'border-2 border-primary shadow-md bg-indigo-50/30' 
                      : isDone 
                        ? 'border-emerald-200/80 bg-emerald-50/20' 
                        : 'border-slate-200/80 hover:border-indigo-200'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Hour Time Pill / Done Toggle */}
                      <button
                        type="button"
                        onClick={() => editHourlyLog(hl.id, { done: !hl.done, tag: !hl.done ? 'DONE' : 'PLANNED' })}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors shadow-sm ${
                          isDone 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white border-2 border-slate-300 hover:border-emerald-500'
                        }`}
                        title={isDone ? 'Mark uncompleted' : 'Mark done'}
                      >
                        {isDone && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-primary">
                            {hl.hourSlot}
                          </span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                            isActive 
                              ? 'bg-primary text-white animate-pulse' 
                              : isDone 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {hl.tag || (isDone ? 'DONE' : 'PLANNED')}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            · {hl.category}
                          </span>
                        </div>

                        <h4 className={`text-sm font-extrabold mt-1 truncate ${
                          isDone ? 'text-slate-700' : 'text-slate-900'
                        }`}>
                          {hl.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">
                          {hl.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="text-xs font-mono font-bold text-slate-400 mr-1">
                        {hl.durationMinutes}m
                      </span>
                      <button 
                        type="button"
                        onClick={() => setEditingLog(hl)}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-colors"
                        title="Edit this hour log"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          deleteHourlyLog(hl.id);
                          showToast('Hour entry deleted');
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Delete hour entry"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-white/70 backdrop-blur-md border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">more_time</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Hourly Activity for {currentDate}</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Your timeline changes daily! Tap below to record what you've done during this hour.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddHourModalOpen(true)}
                  className="mt-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  + Log What I Done
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* BOTTOM SHARE BUTTON (Makes into text and can share) */}
          {/* ========================================================= */}
          <div className="pt-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-violet-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share Hourly Log</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Export every hour's activity as text</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handleShareScreen}
                  className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Share
                </button>
                <button 
                  type="button"
                  onClick={() => openReportModal('timeline')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                  title="View paper report"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add New Hour Column / Log Modal */}
      {isAddHourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
                <h3 className="text-sm font-bold text-slate-900">Log What I Done This Hour</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddHourModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateHour} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Hour Slot</label>
                  <input 
                    type="text"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    placeholder="e.g. 04:00 - 05:00 PM"
                    required
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Duration (Min)</label>
                  <input 
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    min="5"
                    max="180"
                    required
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">What Did You Do?</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. LeetCode Graph BFS or Client Meeting"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="Deep Work">Deep Work</option>
                  <option value="Code">Code</option>
                  <option value="Dev">Dev</option>
                  <option value="Habit">Habit</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Reset">Reset</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Prep">Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Deliverable Details / Notes</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What was completed or produced during this hour?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddHourModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Record Hour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hour Modal */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">edit</span>
                <h3 className="text-sm font-bold text-slate-900">Edit Hour Log</h3>
              </div>
              <button 
                type="button"
                onClick={() => setEditingLog(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time Slot</label>
                  <input 
                    type="text"
                    value={editingLog.hourSlot}
                    onChange={(e) => setEditingLog({ ...editingLog, hourSlot: e.target.value })}
                    required
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Duration (Min)</label>
                  <input 
                    type="number"
                    value={editingLog.durationMinutes || 60}
                    onChange={(e) => setEditingLog({ ...editingLog, durationMinutes: e.target.value })}
                    required
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Activity Title</label>
                <input 
                  type="text"
                  value={editingLog.title}
                  onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select 
                  value={editingLog.category}
                  onChange={(e) => setEditingLog({ ...editingLog, category: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="Deep Work">Deep Work</option>
                  <option value="Code">Code</option>
                  <option value="Dev">Dev</option>
                  <option value="Habit">Habit</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Reset">Reset</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Prep">Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Notes</label>
                <textarea 
                  value={editingLog.description || ''}
                  onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
