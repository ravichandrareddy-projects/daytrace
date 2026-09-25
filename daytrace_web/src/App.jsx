import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import RainbowShaderCanvas from './components/VisualEffects/RainbowShaderCanvas';
import DesktopLayout from './layouts/DesktopLayout';
import MobileLayout from './layouts/MobileLayout';
import TodayPage from './pages/TodayPage';
import MoneyPage from './pages/MoneyPage';
import TimelinePage from './pages/TimelinePage';
import MemoriesPage from './pages/MemoriesPage';
import IdeasPage from './pages/IdeasPage';
import SettingsPage from './pages/SettingsPage';
import AddBlockModal from './components/Modals/AddBlockModal';
import AddExpenseModal from './components/Modals/AddExpenseModal';
import LiveFocusActionModal from './components/Modals/LiveFocusActionModal';
import PaperReportModal from './components/Modals/PaperReportModal';
import GlobalSearchModal from './components/Modals/GlobalSearchModal';
import TomorrowReviewModal from './components/Modals/TomorrowReviewModal';
import UPIPurchaseOverlay from './components/Modals/UPIPurchaseOverlay';
import appTracker from './services/AppTrackingService';
import callLogService from './services/CallLogService';
import upiDetector from './services/UPIDetectionService';
import syncService from './services/SyncService';

/**
 * Hook: Detect if screen is desktop-sized (≥768px)
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    setIsDesktop(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

function AppContent() {
  const { state, setActiveTab, addAppUsageLog, addDistraction } = useApp();
  const { activeTab } = state;
  const isDesktop = useIsDesktop();
  const currentTheme = state.settings?.theme || 'aurora';
  const isAurora = currentTheme === 'aurora' || currentTheme === 'aurora_night';
  const isRainbow = currentTheme === 'rainbow';
  const isPlainBlack = currentTheme === 'plain_black' || currentTheme === 'black';
  const isPlainWhite = currentTheme === 'plain_white' || currentTheme === 'white';

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['today', 'timeline', 'money', 'ideas', 'memories', 'more', 'settings'].includes(hash)) {
        setActiveTab(hash === 'settings' ? 'more' : hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setActiveTab]);

  // Initialize Background Services (24/7 Tracking & Sync)
  React.useEffect(() => {
    // 1. Start App Tracking
    appTracker.start();
    
    // 2. Start Call Log tracking
    callLogService.start();

    // 3. Setup UPI Detection callback
    upiDetector.setOnUPIAppClosed((info) => {
      // Dispatch an event that the overlay component listens to
      window.dispatchEvent(new CustomEvent('daytrace:upi-app-closed', { detail: info }));
    });

    // Subscribe context to app tracker so logs go into state
    const unsubscribeTracker = appTracker.onLogUpdate((entry) => {
      // Update the context's appUsageLogs array
      addAppUsageLog?.(entry);
      
      // Send to UPI detector
      upiDetector.handleAppLogEntry(entry);
      
      // Distraction checking
      if (state.liveFocus?.isRunning && entry.category !== 'productivity' && entry.category !== 'education') {
         addDistraction?.(entry);
      }
    });

    // 4. Try auto-reconnect for QR sync
    syncService.tryAutoReconnect();

    return () => {
      appTracker.stop();
      callLogService.stop();
      unsubscribeTracker();
    };
  }, []); // Run once on mount

  // Pass active session to tracker
  React.useEffect(() => {
    if (state.liveFocus?.isRunning) {
      appTracker.setActiveFocusSession(state.liveFocus.title);
    } else {
      appTracker.setActiveFocusSession(null);
    }
  }, [state.liveFocus?.isRunning, state.liveFocus?.title]);

  // Page content (shared between mobile and desktop)
  const pageContent = (
    <>
      {activeTab === 'today' && <TodayPage />}
      {activeTab === 'timeline' && <TimelinePage />}
      {activeTab === 'money' && <MoneyPage />}
      {activeTab === 'ideas' && <IdeasPage />}
      {activeTab === 'memories' && <MemoriesPage />}
      {(activeTab === 'settings' || activeTab === 'more') && <SettingsPage />}
    </>
  );

  return (
    <div 
      className={`relative min-h-screen text-on-surface flex flex-col font-sans selection:bg-primary/10 ${
        isAurora ? 'theme-aurora dark bg-slate-950' : 
        isRainbow ? 'theme-rainbow bg-white/90' :
        isPlainBlack ? 'theme-plain-black dark bg-black' : 
        isPlainWhite ? 'theme-plain-white bg-slate-50' : 'bg-transparent'
      }`}
      data-theme={currentTheme}
    >
      {/* Background Rainbow / Aurora Shimmer */}
      <RainbowShaderCanvas />

      {/* Responsive Layout: Desktop sidebar vs Mobile bottom tabs */}
      {isDesktop ? (
        <DesktopLayout>{pageContent}</DesktopLayout>
      ) : (
        <MobileLayout>{pageContent}</MobileLayout>
      )}

      {/* Global Modals */}
      <AddBlockModal />
      <AddExpenseModal />
      <LiveFocusActionModal />
      <PaperReportModal />
      <GlobalSearchModal />
      <TomorrowReviewModal />
      <UPIPurchaseOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
