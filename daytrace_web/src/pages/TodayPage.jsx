import React, { useState } from 'react';
import { useApp, getTodayDateKey, formatDisplayDate, shiftDateKey } from '../context/AppContext';

export default function TodayPage() {
  const { 
    state, 
    setSelectedDate,
    formatMoney, 
    setActiveTab, 
    toggleLiveFocusTimer, 
    openLiveActionModal, 
    openReportModal, 
    toggleSearchModal,
    setIsReviewCutoffOpen,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    shareScreenText,
    updateUserProfile
  } = useApp();

  const { liveFocus, moneyState, todos = [] } = state;

  const currentDateKey = state.selectedDate || getTodayDateKey();
  const isCurrentToday = currentDateKey === getTodayDateKey();
  const displayDate = formatDisplayDate(currentDateKey);

  const handlePrevDay = () => {
    setSelectedDate(shiftDateKey(currentDateKey, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(shiftDateKey(currentDateKey, 1));
  };

  const handleJumpToday = () => {
    setSelectedDate(getTodayDateKey());
  };

  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const userName = state.settings?.userName || 'User';

  // Local state for Todo filters, addition & profile edit
  const [activeFilter, setActiveFilter] = useState('all'); // all | high | work | habits
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('high'); // high | medium | low
  const [newCategory, setNewCategory] = useState('Study // Code');
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [editNameInput, setEditNameInput] = useState(userName);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics calculation from REAL user data
  const totalTodos = todos.length;
  const doneTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - doneTodos;

  const dayHourlyLogs = state.hourlyLogs || [];
  const recordedFromHourly = dayHourlyLogs.filter(h => h.done).reduce((acc, h) => acc + (h.durationMinutes || 60), 0);
  const liveMins = isCurrentToday ? Math.floor(liveFocus.elapsedSeconds / 60) : 0;
  const totalRecordedMins = recordedFromHourly + liveMins;
  const recHours = Math.floor(totalRecordedMins / 60);
  const recMins = totalRecordedMins % 60;

  const plannedDurationMins = Math.max(totalRecordedMins, totalTodos * 45);
  const planHours = Math.floor(plannedDurationMins / 60);
  const planMins = plannedDurationMins % 60;
  const percentRecorded = plannedDurationMins > 0 ? Math.min(100, Math.round((totalRecordedMins / plannedDurationMins) * 100)) : 0;

  const liveElapsedMins = Math.floor(liveFocus.elapsedSeconds / 60);
  const liveRemainingMins = Math.max(0, liveFocus.totalMinutes - liveElapsedMins);
  const livePercent = Math.min(100, Math.round((liveElapsedMins / liveFocus.totalMinutes) * 100));

  // Filtered todos
  const filteredTodos = todos.filter(t => {
    if (activeFilter === 'high') return t.priority === 'high';
    if (activeFilter === 'work') return t.category.toLowerCase().includes('work') || t.category.toLowerCase().includes('dev');
    if (activeFilter === 'habits') return t.category.toLowerCase().includes('habit') || t.category.toLowerCase().includes('fuel');
    return true;
  });

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTodo({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: ''
    }, currentDateKey);
    setNewTitle('');
    showToast('Task added for ' + (isCurrentToday ? 'today' : displayDate));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTodo || !editingTodo.title.trim()) return;
    editTodo(editingTodo.id, {
      title: editingTodo.title.trim(),
      priority: editingTodo.priority,
      category: editingTodo.category,
      note: editingTodo.note || ''
    });
    setEditingTodo(null);
    showToast('Task updated successfully');
  };

  const handleShareScreen = async () => {
    const res = await shareScreenText('today');
    if (res.method === 'native') {
      showToast('Shared via device sheet!');
    } else {
      showToast('Plaintext report copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative z-10 bg-transparent pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header (Exact from stitch template with functional controls) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl pt-safe border-b border-slate-200/40 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
              <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-md text-headline-md tracking-tight text-on-surface leading-none font-bold">DayTrace</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-0.5">Today</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            {/* Share Paper / TXT Report */}
            <button 
              onClick={() => openReportModal('today')}
              aria-label="Share telemetry report" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
            
            {/* Search */}
            <button 
              onClick={() => toggleSearchModal(true)}
              aria-label="Search day" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm" 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Profile Avatar */}
            <div 
              onClick={() => setActiveTab('more')}
              aria-label="Profile" 
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-sm cursor-pointer ml-1"
            >
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
        </div>
      </header>

      {/* Main Stream Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-gutter-mobile pt-20">
        <div className="space-y-space-md">
          {/* Weather & Active Flow Status Bar */}
          <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
            <span className="font-bold text-on-surface uppercase tracking-wide">{displayDate}</span>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-amber-500">wb_sunny</span>
                26°C · Clear
              </span>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full border border-primary/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Active Flow
              </span>
            </div>
          </div>

          {/* Greeting Hero */}
          <div className="flex items-center justify-between">
            <div>
              <div 
                onClick={() => {
                  setEditNameInput(userName);
                  setIsEditNameModalOpen(true);
                }}
                className="group cursor-pointer inline-flex items-center gap-2"
                title="Tap to change your user name"
              >
                <h1 className="font-headline-xl text-headline-xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                  {timeGreeting}, {userName}
                </h1>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">edit</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Daily to-do and rhythm tracking for {displayDate}.
              </p>
            </div>
          </div>

          {/* Workload 4-Metric Grid (Dynamic Real Metrics) */}
          <div className="grid grid-cols-2 gap-space-sm">
            {/* Card 1: Planned Budget */}
            <div className="flex flex-col p-space-md rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Planned</span>
                <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {plannedDurationMins > 0 ? `${planHours > 0 ? `${planHours}h ` : ''}${planMins}m` : '0m'}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                {totalTodos > 0 ? `${totalTodos} tasks planned` : 'Clean slate'}
              </span>
            </div>

            {/* Card 2: Recorded Time */}
            <div className="flex flex-col p-space-md rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Recorded</span>
                <span className="inline-flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-container/70 px-1.5 py-0.5 rounded-full">
                  {percentRecorded}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">
                  {totalRecordedMins > 0 ? `${recHours > 0 ? `${recHours}h ` : ''}${recMins}m` : '0m'}
                </span>
              </div>
              <div className="w-full bg-slate-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${percentRecorded}%` }}></div>
              </div>
            </div>

            {/* Card 3: Tasks Done */}
            <div className="flex flex-col p-space-md rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Done</span>
                <span className="material-symbols-outlined text-[18px] text-secondary">task_alt</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {doneTodos} <span className="text-on-surface-variant font-headline-md text-headline-md font-normal">/ {totalTodos}</span>
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                {pendingTodos} pending tasks
              </span>
            </div>

            {/* Card 4: Day Burn */}
            <div 
              onClick={() => setActiveTab('money')}
              className="flex flex-col p-space-md rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Spent</span>
                <span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {formatMoney(moneyState.todayFlowINR, { noDecimals: true })}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                {moneyState.todayFlowCount > 0 ? `${moneyState.todayFlowCount} transfers` : 'Clean ledger'}
              </span>
            </div>
          </div>

          {/* Live Current Activity Card (NOW // LIVE FOCUS) */}
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 p-space-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>
            <div className="flex flex-col space-y-space-md">
              {/* Session Badge + Pulse */}
              <div className="flex items-center justify-between">
                <div 
                  onClick={toggleLiveFocusTimer}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 cursor-pointer hover:bg-primary/15 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    {liveFocus.isRunning && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="font-label-sm text-label-sm font-bold text-primary tracking-wide">
                    {liveFocus.isRunning ? liveFocus.tag : 'PAUSED · DEV · 09:00 - 10:30 AM'}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  Streak #{liveFocus.streak}
                </span>
              </div>

              {/* Activity Title & Details */}
              <div>
                <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
                  {liveFocus.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  {liveFocus.subtitle}
                </p>
              </div>

              {/* Progress Meter */}
              <div 
                onClick={toggleLiveFocusTimer}
                className="bg-surface-container-low/60 backdrop-blur-md p-space-md rounded-xl space-y-2 border border-slate-200/40 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      {liveFocus.isRunning ? 'schedule' : 'pause_circle'}
                    </span>
                    {liveElapsedMins}m elapsed
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface-variant">
                    {liveRemainingMins}m left
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-high/70 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${livePercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-0.5">
                  <span>{liveFocus.startTimeStr}</span>
                  <span className="font-semibold text-primary">{livePercent}% complete</span>
                  <span>{liveFocus.endTimeStr}</span>
                </div>
              </div>

              {/* Tactile Action Controls */}
              <div className="grid grid-cols-4 gap-space-xs pt-1">
                <button 
                  onClick={() => openLiveActionModal('stop')}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-error-container/85 backdrop-blur-md text-on-error-container hover:opacity-90 active:scale-95 transition-all shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                  <span className="font-label-sm text-label-sm mt-0.5">Stop</span>
                </button>
                <button 
                  onClick={() => openLiveActionModal('edit')}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-white/85 backdrop-blur-md border border-slate-200/40 text-on-surface hover:bg-white active:scale-95 transition-all shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  <span className="font-label-sm text-label-sm mt-0.5">Edit</span>
                </button>
                <button 
                  onClick={() => openLiveActionModal('note')}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-white/85 backdrop-blur-md border border-slate-200/40 text-on-surface hover:bg-white active:scale-95 transition-all shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">notes</span>
                  <span className="font-label-sm text-label-sm mt-0.5">Note</span>
                </button>
                <button 
                  onClick={() => openLiveActionModal('voice')}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-white/85 backdrop-blur-md border border-slate-200/40 text-on-surface hover:bg-white active:scale-95 transition-all shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                  <span className="font-label-sm text-label-sm mt-0.5">Voice</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tomorrow's Planning Cutoff Banner */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">event_upcoming</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">Tomorrow's Planning Cutoff</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Closes tonight at 11:30 PM</span>
              </div>
            </div>
            <button 
              onClick={() => setIsReviewCutoffOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200/50 text-primary font-label-md text-label-md font-bold shadow-sm hover:bg-white active:scale-95 transition-all" 
              type="button"
            >
              Review
            </button>
          </div>

          {/* ========================================================= */}
          {/* TODAY'S PRIORITY TODO LIST (Replaces the old timetable) */}
          {/* ========================================================= */}
          <div className="flex flex-col space-y-3 pt-2">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[17px]">checklist</span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">To Do List</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/90 border border-slate-200/60 text-primary font-label-sm text-label-sm font-bold shadow-sm">
                  {doneTodos}/{totalTodos} Done
                </span>
              </div>

              {/* View Timeline Button */}
              <button 
                onClick={() => setActiveTab('timeline')}
                className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline"
              >
                Hourly Log →
              </button>
            </div>

            {/* Date Stepper for Daily Tasks */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm rounded-xl p-1.5 border border-slate-200/70">
              <button 
                type="button"
                onClick={handlePrevDay} 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" 
                title="Previous day"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleJumpToday} title={isCurrentToday ? 'Current Day' : 'Click to jump to Today'}>
                <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">{displayDate}</span>
                {isCurrentToday ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary uppercase">Today</span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 hover:bg-primary/20 hover:text-primary transition-colors">Jump Today</span>
                )}
              </div>
              <button 
                type="button"
                onClick={handleNextDay} 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" 
                title="Next day"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Quick Add Todo Form */}
            <form onSubmit={handleCreateTodo} className="p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder={`+ Add new task for ${isCurrentToday ? 'today' : displayDate}...`}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all shrink-0"
                >
                  Add Task
                </button>
              </div>

              {/* Tag Controls for new task */}
              <div className="flex items-center justify-between text-xs gap-2 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Priority:</span>
                  <div className="flex rounded-lg bg-slate-100 p-0.5">
                    {['high', 'medium', 'low'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition-colors ${
                          newPriority === p 
                            ? (p === 'high' ? 'bg-rose-500 text-white' : p === 'medium' ? 'bg-indigo-600 text-white' : 'bg-slate-600 text-white')
                            : 'text-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none"
                >
                  <option value="Study // Code">Study // Code</option>
                  <option value="Work">Work</option>
                  <option value="Dev">Dev</option>
                  <option value="Deep Work">Deep Work</option>
                  <option value="Habit">Habit</option>
                  <option value="Prep">Prep</option>
                </select>
              </div>
            </form>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: `All (${totalTodos})` },
                { id: 'high', label: `High Priority (${todos.filter(t => t.priority === 'high').length})` },
                { id: 'work', label: 'Work & Dev' },
                { id: 'habits', label: 'Habits' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all shadow-sm ${
                    activeFilter === f.id
                      ? 'bg-primary text-white shadow-primary/20'
                      : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Todo Items List */}
            <div className="space-y-2">
              {filteredTodos.map((todo) => {
                const isDone = todo.completed;
                return (
                  <div 
                    key={todo.id}
                    className={`p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border transition-all flex items-start justify-between shadow-sm group ${
                      isDone 
                        ? 'border-emerald-200/80 bg-emerald-50/20' 
                        : 'border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Checkbox */}
                      <button 
                        type="button"
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors shadow-sm ${
                          isDone 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white border-2 border-slate-300 hover:border-emerald-500'
                        }`}
                        title={isDone ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {isDone && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Priority badge */}
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                            todo.priority === 'high' 
                              ? 'bg-rose-100 text-rose-700' 
                              : todo.priority === 'medium'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {todo.priority}
                          </span>
                          {/* Category */}
                          <span className="text-[11px] font-semibold text-slate-400">
                            · {todo.category}
                          </span>
                          {todo.time && (
                            <span className="text-[10px] font-mono text-slate-400">
                              · {todo.time}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-bold mt-1 transition-all ${
                          isDone ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}>
                          {todo.title}
                        </h4>
                        {todo.note && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {todo.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button 
                        type="button"
                        onClick={() => setEditingTodo(todo)}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-colors"
                        title="Edit task"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          deleteTodo(todo.id);
                          showToast('Task removed');
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Delete task"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTodos.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-white/70 backdrop-blur-md border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2.5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">checklist</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {todos.length === 0 ? `Clean Slate for ${displayDate}` : `No Tasks in "${activeFilter}" Filter`}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    {todos.length === 0 
                      ? "To-do lists change daily! Type your first real task above to start planning this day." 
                      : "Switch filter to 'All' or add a task under this category."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM SHARE BUTTON (Makes into text and can share) */}
          {/* ========================================================= */}
          <div className="pt-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share Daily Report</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Export today's tasks &amp; metrics as text</p>
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
                  onClick={() => openReportModal('today')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                  title="View formatted paper report"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Todo Modal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">edit_square</span>
                <h3 className="text-sm font-bold text-slate-900">Edit Task</h3>
              </div>
              <button 
                type="button"
                onClick={() => setEditingTodo(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
                <input 
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Priority</label>
                  <select 
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                  <select 
                    value={editingTodo.category}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Study // Code">Study // Code</option>
                    <option value="Work">Work</option>
                    <option value="Dev">Dev</option>
                    <option value="Deep Work">Deep Work</option>
                    <option value="Habit">Habit</option>
                    <option value="Prep">Prep</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Note / Deliverable</label>
                <input 
                  type="text"
                  value={editingTodo.note || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, note: e.target.value })}
                  placeholder="Optional deliverable notes"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setEditingTodo(null)}
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

      {/* Edit User Name Modal */}
      {isEditNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                <h3 className="text-sm font-bold text-slate-900">Change Your Name</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditNameModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!editNameInput.trim()) return;
                updateUserProfile({ userName: editNameInput.trim() });
                setIsEditNameModalOpen(false);
                showToast(`Name updated to "${editNameInput.trim()}"`);
              }} 
              className="space-y-3 pt-1"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Name</label>
                <input 
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  placeholder="e.g. Alex, Arjun, Sarah"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditNameModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
