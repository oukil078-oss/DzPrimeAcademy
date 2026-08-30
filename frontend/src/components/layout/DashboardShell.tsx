'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingBotWidget } from '@/components/bot/FloatingBotWidget';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore, hydrateDefaultPersonaForPath } from '@/lib/store';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isRtl, locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    hydrateDefaultPersonaForPath(pathname || '');
  }, [pathname]);

  const isGuestLanding = !currentUser && (pathname === `/${locale}` || pathname === `/${locale}/`);

  if (isGuestLanding) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#F4F6FA] dark:bg-[#040817] text-slate-900 dark:text-white transition-colors" data-testid="guest-landing-shell">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingBotWidget />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen w-full bg-[#F4F6FA] dark:bg-[#040817] text-slate-900 dark:text-white transition-colors ${isRtl ? 'flex-row-reverse' : 'flex-row'}`} data-testid="app-dashboard-shell">
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

