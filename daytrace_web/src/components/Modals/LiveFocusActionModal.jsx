import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LiveFocusActionModal() {
  const { state, closeLiveActionModal, addFocusNote, toggleLiveFocusTimer } = useApp();
  const [noteInput, setNoteInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  if (!state.isLiveActionOpen) return null;

  const type = state.liveActionType;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addFocusNote(noteInput.trim());
    setNoteInput('');
    closeLiveActionModal();
  };

  const handleStopSession = () => {
    if (state.liveFocus.isRunning) {
      toggleLiveFocusTimer();
    }
    closeLiveActionModal();
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      const interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        addFocusNote('Voice Note: Recorded 6s audio snippet on graph optimization.');
        closeLiveActionModal();
      }, 6000);
    } else {
      setIsRecording(false);
      closeLiveActionModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === 'stop' ? 'bg-rose-100 text-rose-600' :
              type === 'note' ? 'bg-amber-100 text-amber-600' :
              type === 'voice' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-700'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {type === 'stop' ? 'stop_circle' : type === 'note' ? 'notes' : type === 'voice' ? 'mic' : 'edit'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface capitalize">
              {type === 'stop' ? 'Finish Focus Session' : type === 'note' ? 'Quick Focus Note' : type === 'voice' ? 'Voice Memo' : 'Edit Session'}
            </h3>
          </div>
          <button 
            onClick={closeLiveActionModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {type === 'stop' && (
          <div className="space-y-4 text-center py-2">
            <p className="text-body-md text-slate-600">
              Are you sure you want to stop <strong>Python Practice</strong>?
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-label-md text-slate-700">
              Elapsed: <span className="font-bold text-primary">{Math.floor(state.liveFocus.elapsedSeconds / 60)} minutes</span> · Streak maintained 🔥
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={closeLiveActionModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-label-md hover:bg-slate-50"
              >
                Keep Going
              </button>
              <button
                onClick={handleStopSession}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-label-md font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Stop &amp; Log
              </button>
            </div>
          </div>
        )}

        {type === 'note' && (
          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows="3"
              placeholder="Jot down a quick insight, blocker, or idea during this focus session..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-body-md focus:outline-none focus:border-primary"
            ></textarea>
            {state.liveFocus.notes.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Previous Notes</span>
                {state.liveFocus.notes.map((n, i) => (
                  <div key={i} className="text-body-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={closeLiveActionModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-label-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-label-md font-bold hover:bg-primary-container"
              >
                Save Note
              </button>
            </div>
          </form>
        )}

        {type === 'voice' && (
          <div className="py-4 flex flex-col items-center justify-center space-y-4 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
            }`}>
              <span className="material-symbols-outlined text-[36px]">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">
                {isRecording ? `Recording... 00:0${recordingSeconds}` : 'Neural Voice Log'}
              </h4>
              <p className="text-body-sm text-slate-500 max-w-xs mt-1">
                {isRecording ? 'Listening and transcribing speech to focus context...' : 'Tap to start speaking. Neural OCR & speech transcription will attach to this block.'}
              </p>
            </div>
            <button
              onClick={handleToggleVoice}
              className={`px-6 py-2.5 rounded-xl font-label-md font-bold text-white transition-all shadow-md ${
                isRecording ? 'bg-slate-800 hover:bg-slate-900' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRecording ? 'Stop & Transcribe' : 'Start Recording'}
            </button>
          </div>
        )}

        {type === 'edit' && (
          <div className="space-y-3 py-1">
            <div>
              <label className="block text-label-sm text-slate-500 font-semibold mb-1">Session Title</label>
              <input 
                type="text" 
                defaultValue={state.liveFocus.title}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-body-md"
              />
            </div>
            <div>
              <label className="block text-label-sm text-slate-500 font-semibold mb-1">Target Minutes</label>
              <input 
                type="number" 
                defaultValue={state.liveFocus.totalMinutes}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-body-md"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={closeLiveActionModal} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600">Cancel</button>
              <button onClick={closeLiveActionModal} className="flex-1 py-2 rounded-xl bg-primary text-white font-bold">Apply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
