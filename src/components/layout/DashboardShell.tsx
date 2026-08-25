'use client';

import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingBotWidget } from '@/components/bot/FloatingBotWidget';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isRtl } = useTranslation();

  return (
    <div className={`flex min-h-screen w-full bg-[#F4F6FA] dark:bg-[#040817] text-slate-900 dark:text-white transition-colors ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <AppSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>

      {/* Floating AI Bot Assistant */}
      <FloatingBotWidget />
    </div>
  );
};
