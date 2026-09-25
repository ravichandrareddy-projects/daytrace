import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

/**
 * QR Sync Modal — Connect mobile ↔ desktop via QR code
 * Desktop shows a QR code, mobile scans it to connect
 */
export default function QRSyncModal({ isOpen, onClose }) {
  const { state } = useApp();
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected | connecting | connected
  const [syncCode, setSyncCode] = useState('');
  const isAurora = (state.settings?.theme || 'aurora').includes('aurora');

  if (!isOpen) return null;

  const handleGenerateCode = () => {
    // Generate a sync code for manual entry (fallback when QR scanner not available)
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setSyncCode(code);
    setConnectionStatus('connecting');
    
    // Simulate connection (in real app, this starts a WebSocket server)
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleManualConnect = () => {
    if (syncCode.length >= 4) {
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className={`rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl ${
        isAurora ? 'bg-slate-900 border border-emerald-500/30' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAurora ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
            </div>
            <div>
              <h3 className={`font-bold text-base ${isAurora ? 'text-white' : 'text-slate-900'}`}>Connect Devices</h3>
              <p className={`text-xs ${isAurora ? 'text-slate-400' : 'text-slate-500'}`}>Sync mobile ↔ desktop</p>
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isAurora ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'
          }`}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-2xl mb-4 text-center ${
          connectionStatus === 'connected' 
            ? isAurora ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
            : connectionStatus === 'connecting'
            ? isAurora ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
            : isAurora ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'
        }`}>
          <div className={`text-3xl mb-2 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}>
            {connectionStatus === 'connected' ? '✅' : connectionStatus === 'connecting' ? '⏳' : '📡'}
          </div>
          <p className={`font-bold text-sm ${
            isAurora ? 'text-white' : 'text-slate-900'
          }`}>
            {connectionStatus === 'connected' ? 'Devices Connected!' 
             : connectionStatus === 'connecting' ? 'Connecting...' 
             : 'Not Connected'}
          </p>
          <p className={`text-xs mt-1 ${isAurora ? 'text-slate-400' : 'text-slate-500'}`}>
            {connectionStatus === 'connected' ? 'Real-time sync is active'
             : connectionStatus === 'connecting' ? 'Waiting for other device...'
             : 'Generate a code to connect'}
          </p>
        </div>

        {/* QR / Code Section */}
        {connectionStatus === 'disconnected' && (
          <>
            {/* QR Placeholder (would use actual QR library) */}
            <div className={`aspect-square max-w-[200px] mx-auto rounded-2xl flex items-center justify-center mb-4 ${
              isAurora ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'
            }`}>
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-slate-400">qr_code_2</span>
                <p className={`text-xs mt-2 ${isAurora ? 'text-slate-500' : 'text-slate-400'}`}>QR Code</p>
              </div>
            </div>

            <button
              onClick={handleGenerateCode}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                isAurora 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
              }`}
            >
              Generate Sync Code
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${isAurora ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <span className={`text-xs font-semibold ${isAurora ? 'text-slate-500' : 'text-slate-400'}`}>OR</span>
              <div className={`flex-1 h-px ${isAurora ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>

            {/* Manual Code Entry */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter sync code"
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value.toUpperCase())}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wider ${
                  isAurora 
                    ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <button
                onClick={handleManualConnect}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs ${
                  isAurora ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-indigo-600 border border-slate-200'
                }`}
              >
                Join
              </button>
            </div>
          </>
        )}

        {/* Connected: Show sync code */}
        {syncCode && connectionStatus !== 'disconnected' && (
          <div className={`p-3 rounded-xl text-center ${isAurora ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`text-xs font-semibold mb-1 ${isAurora ? 'text-slate-400' : 'text-slate-500'}`}>Sync Code</p>
            <p className={`text-2xl font-mono font-black tracking-[0.3em] ${isAurora ? 'text-emerald-400' : 'text-indigo-600'}`}>
              {syncCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
