import React from 'react';
import Sidebar from '../components/Navigation/Sidebar';

/**
 * Desktop Layout — Sidebar navigation + wide content area
 * Shown when screen width ≥ 768px
 */
export default function DesktopLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content — offset by sidebar width */}
      <main className="ml-[220px] flex-1 w-full min-h-screen">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
