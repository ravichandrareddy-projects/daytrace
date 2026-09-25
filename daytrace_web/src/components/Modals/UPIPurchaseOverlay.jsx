import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

/**
 * UPI Purchase Overlay — Shows when a UPI app is closed
 * Asks "Did you make a purchase? Yes / No"
 * - Yes → Navigate to Money tab + open Add Expense modal
 * - No → Dismiss
 * - Tap outside → Slowly fade out + show notification toast
 */
export default function UPIPurchaseOverlay() {
  const { state, setActiveTab, openExpenseModal } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [upiAppInfo, setUpiAppInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const overlayRef = useRef(null);

  // Listen for UPI app close events (from AppContext or global event)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.appInfo) {
        setUpiAppInfo(e.detail);
        setIsVisible(true);
        setIsExiting(false);
      }
    };
    window.addEventListener('daytrace:upi-app-closed', handler);
    return () => window.removeEventListener('daytrace:upi-app-closed', handler);
  }, []);

  const handleYes = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      // Navigate to Money tab and open expense modal
      setActiveTab('money');
      // Dispatch event to open expense modal with UPI pre-fill
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('daytrace:open-expense', {
          detail: { source: 'UPI', appName: upiAppInfo?.appInfo?.name || 'UPI Payment' }
        }));
      }, 300);
    }, 300);
  };

  const handleNo = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target === overlayRef.current) {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        // Show top notification
        setNotification('💡 Don\'t forget to log your expenses!');
        setTimeout(() => setNotification(null), 4000);
      }, 500);
    }
  };

  if (!isVisible && !notification) return null;

  const appName = upiAppInfo?.appInfo?.name || 'UPI App';
  const appIcon = upiAppInfo?.appInfo?.icon || '💳';
  const appColor = upiAppInfo?.appInfo?.color || '#6366F1';

  return (
    <>
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-2 backdrop-blur-xl">
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isVisible && (
        <div
          ref={overlayRef}
          onClick={handleOutsideClick}
          className={`fixed inset-0 z-[150] flex items-center justify-center transition-all duration-500 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 mx-6 max-w-sm w-full shadow-2xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ${
            isExiting ? 'scale-90 opacity-0' : 'scale-100 opacity-100 animate-in zoom-in-95'
          }`}>
            {/* App Icon & Name */}
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{ backgroundColor: appColor + '20', border: `2px solid ${appColor}40` }}
              >
                {appIcon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Just Closed</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{appName}</p>
              </div>
            </div>

            {/* Question */}
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-6">
              Did you make a purchase? 💸
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleYes}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>✅</span>
                <span>Yes, Log It</span>
              </button>
              <button
                onClick={handleNo}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <span>❌</span>
                <span>No</span>
              </button>
            </div>

            {/* Hint */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
              Tap outside to dismiss
            </p>
          </div>
        </div>
      )}
    </>
  );
}
