import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import RainbowShaderCanvas from './components/VisualEffects/RainbowShaderCanvas';
import BottomTabBar from './components/Navigation/BottomTabBar';
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

function AppContent() {
  const { state, setActiveTab } = useApp();
  const { activeTab } = state;
  const currentTheme = state.settings?.theme || 'aurora';
  const isAurora = currentTheme === 'aurora' || currentTheme === 'aurora_night';
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

  return (
    <div 
      className={`relative min-h-screen text-on-surface flex flex-col font-sans selection:bg-primary/10 ${
        isAurora ? 'theme-aurora dark bg-slate-950' : 
        isPlainBlack ? 'theme-plain-black dark bg-black' : 
        isPlainWhite ? 'theme-plain-white bg-slate-50' : 'bg-transparent'
      }`}
      data-theme={currentTheme}
    >
      {/* Background WebGL Rainbow / Aurora Shimmer Shader & Overlays */}
      <RainbowShaderCanvas />

      {/* Screen Render based on activeTab (strictly matching the 5 templates) */}
      <div className="flex-1 w-full max-w-md mx-auto relative z-10">
        {activeTab === 'today' && <TodayPage />}
        {activeTab === 'timeline' && <TimelinePage />}
        {activeTab === 'money' && <MoneyPage />}
        {activeTab === 'ideas' && <IdeasPage />}
        {activeTab === 'memories' && <MemoriesPage />}
        {(activeTab === 'settings' || activeTab === 'more') && <SettingsPage />}
      </div>

      {/* Global Bottom Tab Bar Navigation */}
      <BottomTabBar />

      {/* Fully Functional Interactive Modals */}
      <AddBlockModal />
      <AddExpenseModal />
      <LiveFocusActionModal />
      <PaperReportModal />
      <GlobalSearchModal />
      <TomorrowReviewModal />
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
