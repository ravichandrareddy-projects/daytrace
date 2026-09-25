import React from 'react';
import BottomTabBar from '../components/Navigation/BottomTabBar';

/**
 * Mobile Layout — Bottom tab bar navigation
 * Shown when screen width < 768px (phones)
 */
export default function MobileLayout({ children }) {
  return (
    <>
      <div className="flex-1 w-full max-w-md mx-auto relative z-10">
        {children}
      </div>
      <BottomTabBar />
    </>
  );
}
