import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function IdeasPage() {
  const { 
    state, 
    setActiveTab, 
    openReportModal, 
    toggleSearchModal,
    addIdea,
    updateIdea,
    deleteIdea,
    addIdeaProgressLog,
    setIdeaStatus,
    shareScreenText
  } = useApp();

  const ideas = state.ideas || [];

  // Local state for filters and search
  const [activeFilter, setActiveFilter] = useState('all'); // all | in_progress | success | failure | brainstorming
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [logIdeaTarget, setLogIdeaTarget] = useState(null);
  const [newLogText, setNewLogText] = useState('');

  // New Idea form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Startup / Product');
  const [newStatus, setNewStatus] = useState('Brainstorming');
  const [newMatter, setNewMatter] = useState('');
  const [newResearch, setNewResearch] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const totalCount = ideas.length;
  const inProgressCount = ideas.filter(i => i.status === 'In Progress').length;
  const successCount = ideas.filter(i => i.status === 'Success').length;
  const failureCount = ideas.filter(i => i.status === 'Failure').length;
  const brainstormCount = ideas.filter(i => i.status === 'Brainstorming' || i.status === 'Researching').length;

  // Filter ideas
  const filteredIdeas = ideas.filter(i => {
    if (activeFilter === 'in_progress' && i.status !== 'In Progress') return false;
    if (activeFilter === 'success' && i.status !== 'Success') return false;
    if (activeFilter === 'failure' && i.status !== 'Failure') return false;
    if (activeFilter === 'brainstorming' && i.status !== 'Brainstorming' && i.status !== 'Researching') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (i.title || '').toLowerCase().includes(q);
      const matchMatter = (i.matter || '').toLowerCase().includes(q);
      const matchResearch = (i.researchNotes || '').toLowerCase().includes(q);
      const matchCat = (i.category || '').toLowerCase().includes(q);
      const matchNum = (i.number || '').toLowerCase().includes(q);
      return matchTitle || matchMatter || matchResearch || matchCat || matchNum;
    }
    return true;
  });

  const handleCreateIdea = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addIdea({
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      matter: newMatter.trim(),
      researchNotes: newResearch.trim(),
      tags: [`#${newCategory.replace(/\s+/g, '')}`]
    });

    setNewTitle('');
    setNewMatter('');
    setNewResearch('');
    setIsAddIdeaModalOpen(false);
    showToast('New idea brainstorm logged!');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingIdea || !editingIdea.title.trim()) return;

    updateIdea(editingIdea.id, {
      title: editingIdea.title.trim(),
      category: editingIdea.category,
      status: editingIdea.status,
      matter: editingIdea.matter || '',
      researchNotes: editingIdea.researchNotes || ''
    });

    setEditingIdea(null);
    showToast('Idea details updated!');
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logIdeaTarget || !newLogText.trim()) return;

    addIdeaProgressLog(logIdeaTarget.id, newLogText.trim());
    setNewLogText('');
    setLogIdeaTarget(null);
    showToast('Progress update logged!');
  };

  const handleShareIdeas = async () => {
    const res = await shareScreenText('ideas');
    if (res.method === 'native') {
      showToast('Shared ideas ledger!');
    } else {
      showToast('Ideas plain-text copied to clipboard!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Success':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: 'verified',
          label: 'SUCCESS / WON'
        };
      case 'Failure':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: 'cancel',
          label: 'FAILURE / SCRAPPED'
        };
      case 'In Progress':
        return {
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: 'trending_up',
          label: 'IN PROGRESS'
        };
      default:
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: 'lightbulb',
          label: 'BRAINSTORM'
        };
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

      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0 flex items-center justify-center bg-white/70 border border-slate-200/50">
              <img src="/daytrace-logo.png" alt="DayTrace Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary truncate font-bold">Brainstorm Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface truncate font-bold">Ideas</h1>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            {/* Share Ideas */}
            <button 
              onClick={() => openReportModal('ideas')}
              aria-label="Share ideas report" 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 text-on-surface-variant hover:text-primary transition-colors shadow-sm"
              title="Share ideas report"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
            
            {/* Search */}
            <button 
              onClick={() => toggleSearchModal(true)}
              aria-label="Search" 
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
        <div className="h-[2px] w-full rainbow-shimmer opacity-80"></div>
      </header>

      {/* Main Stream */}
      <main className="flex-1 w-full max-w-md mx-auto px-gutter-mobile pt-20">
        <div className="space-y-4">
          
          {/* Top Status & Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="p-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5">{totalCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Active</span>
              <span className="text-xl font-extrabold text-cyan-600 mt-0.5">{inProgressCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Success</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-0.5">{successCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Failed</span>
              <span className="text-xl font-extrabold text-rose-500 mt-0.5">{failureCount}</span>
            </div>
          </div>

          {/* Action Bar: Brainstorm New Idea Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-indigo-500/10 border border-amber-300/40 backdrop-blur-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Brainstorm &amp; Research</h3>
                <p className="text-[11px] text-slate-500 font-medium">Log ideas with progress &amp; outcomes</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddIdeaModalOpen(true)}
              className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              + New Idea
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[19px] pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas, matter, research, tags..."
                className="w-full bg-white/80 backdrop-blur-md text-slate-900 placeholder:text-slate-400 text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-200/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: `All (${totalCount})` },
                { id: 'in_progress', label: `In Progress (${inProgressCount})` },
                { id: 'success', label: `Success (${successCount})` },
                { id: 'failure', label: `Failure (${failureCount})` },
                { id: 'brainstorming', label: `Brainstorm (${brainstormCount})` }
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
          </div>

          {/* Ideas List Stream */}
          <div className="space-y-3.5 pt-1">
            {filteredIdeas.map((idea) => {
              const badge = getStatusBadge(idea.status);
              const logs = idea.progressLogs || [];

              return (
                <div 
                  key={idea.id}
                  className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-indigo-200/80 transition-all flex flex-col gap-3 group"
                >
                  {/* Card Header: Number + Category + Status Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm">
                        {idea.number}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {idea.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        · {idea.dateCreated}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border shadow-sm ${badge.bg}`}>
                        <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {idea.title}
                    </h3>
                  </div>

                  {/* The Matter of the Idea */}
                  {idea.matter && (
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <span className="material-symbols-outlined text-[13px] text-indigo-500">subject</span>
                        Matter / Concept:
                      </div>
                      <p className="whitespace-pre-line">{idea.matter}</p>
                    </div>
                  )}

                  {/* Research & Thoughts */}
                  {idea.researchNotes && (
                    <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/60 text-xs text-slate-700 leading-relaxed">
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 mb-1">
                        <span className="material-symbols-outlined text-[13px] text-indigo-500">biotech</span>
                        Research &amp; Hypotheses:
                      </div>
                      <p className="whitespace-pre-line">{idea.researchNotes}</p>
                    </div>
                  )}

                  {/* Progress Logs Stream */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">timeline</span>
                        Progress Updates ({logs.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLogIdeaTarget(idea);
                          setNewLogText('');
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        + Add Update
                      </button>
                    </div>

                    {logs.length > 0 ? (
                      <div className="space-y-1 pl-2 border-l-2 border-slate-200 mt-1">
                        {logs.slice(0, 3).map((l) => (
                          <div key={l.id} className="text-xs text-slate-600 py-0.5">
                            <span className="text-[10px] font-mono text-slate-400 font-semibold block">{l.time}</span>
                            <span className="font-medium text-slate-800">{l.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No progress logs recorded yet.</p>
                    )}
                  </div>

                  {/* Quick Outcome Toggle Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Outcome:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIdeaStatus(idea.id, 'In Progress');
                          showToast('Set to In Progress');
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                          idea.status === 'In Progress' 
                            ? 'bg-cyan-500 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIdeaStatus(idea.id, 'Success');
                          showToast('Marked as SUCCESS!');
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                          idea.status === 'Success' 
                            ? 'bg-emerald-500 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ✓ Success
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIdeaStatus(idea.id, 'Failure');
                          showToast('Marked as FAILURE');
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                          idea.status === 'Failure' 
                            ? 'bg-rose-500 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ✗ Failure
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingIdea(idea)}
                        className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-colors"
                        title="Edit Idea"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteIdea(idea.id);
                          showToast('Idea removed');
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Delete Idea"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredIdeas.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-white/70 backdrop-blur-md border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">lightbulb</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {ideas.length === 0 ? 'No Ideas in Vault Yet' : `No Ideas matching "${activeFilter}"`}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  {ideas.length === 0
                    ? 'Brainstorm ideas, research thoughts, track progress and record success or failure outcomes.'
                    : 'Try changing the filter or search query above.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddIdeaModalOpen(true)}
                  className="mt-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  + Brainstorm New Idea
                </button>
              </div>
            )}
          </div>

          {/* Bottom Share Button */}
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-indigo-500/10 border border-indigo-200/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share Ideas Ledger</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Export brainstorms, research &amp; outcomes as text</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handleShareIdeas}
                  className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Share
                </button>
                <button 
                  type="button"
                  onClick={() => openReportModal('ideas')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                  title="View report"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 1. ADD NEW IDEA MODAL */}
      {/* ========================================================= */}
      {isAddIdeaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Brainstorm New Idea</h3>
                  <p className="text-[11px] text-slate-400">Auto-assigned Idea #{String(ideas.length + 1).padStart(2, '0')}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddIdeaModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Idea Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Personal Soundscape"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Startup / Product">Startup / Product</option>
                    <option value="App / Code">App / Code</option>
                    <option value="AI / Research">AI / Research</option>
                    <option value="Hardware / Device">Hardware / Device</option>
                    <option value="Content / Media">Content / Media</option>
                    <option value="Workflow / Life">Workflow / Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Brainstorming">Brainstorming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Success">Success (Validated)</option>
                    <option value="Failure">Failure (Scrapped)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Matter of the Idea</label>
                <textarea
                  rows="3"
                  value={newMatter}
                  onChange={(e) => setNewMatter(e.target.value)}
                  placeholder="Describe the core concept, target problem, and how it works..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Research &amp; Thoughts</label>
                <textarea
                  rows="2"
                  value={newResearch}
                  onChange={(e) => setNewResearch(e.target.value)}
                  placeholder="Market research, competitor flaws, technical hypotheses..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddIdeaModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Create Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EDIT IDEA MODAL */}
      {/* ========================================================= */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {editingIdea.number}
                </span>
                <h3 className="text-sm font-bold text-slate-900">Edit Idea</h3>
              </div>
              <button 
                type="button"
                onClick={() => setEditingIdea(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingIdea.category}
                    onChange={(e) => setEditingIdea({ ...editingIdea, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Startup / Product">Startup / Product</option>
                    <option value="App / Code">App / Code</option>
                    <option value="AI / Research">AI / Research</option>
                    <option value="Hardware / Device">Hardware / Device</option>
                    <option value="Content / Media">Content / Media</option>
                    <option value="Workflow / Life">Workflow / Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingIdea.status}
                    onChange={(e) => setEditingIdea({ ...editingIdea, status: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Brainstorming">Brainstorming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Success">Success (Validated)</option>
                    <option value="Failure">Failure (Scrapped)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Matter of the Idea</label>
                <textarea
                  rows="3"
                  value={editingIdea.matter || ''}
                  onChange={(e) => setEditingIdea({ ...editingIdea, matter: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Research &amp; Notes</label>
                <textarea
                  rows="2"
                  value={editingIdea.researchNotes || ''}
                  onChange={(e) => setEditingIdea({ ...editingIdea, researchNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
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

      {/* ========================================================= */}
      {/* 3. ADD PROGRESS UPDATE LOG MODAL */}
      {/* ========================================================= */}
      {logIdeaTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Progress Update</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{logIdeaTarget.number} · {logIdeaTarget.title}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setLogIdeaTarget(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What did you research, build, or discover?</label>
                <textarea
                  rows="3"
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  placeholder="e.g. Tested landing page MVP with 20 users. 14 signed up for beta waitlist."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLogIdeaTarget(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Log Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
