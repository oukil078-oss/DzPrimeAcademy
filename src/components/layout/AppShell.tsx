'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppTopHeader } from '@/components/layout/AppTopHeader';
import { AuthModal } from '@/components/auth/AuthModal';
import { RoleSwitcherModal } from '@/components/shared/RoleSwitcherModal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isRtl, locale } = useTranslation();
  const pathname = usePathname();
  const { currentUser } = useAuthStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if visitor is on root home page
  const isRootHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isGuestOnLanding = !currentUser && isRootHome;

  // If guest is on root landing page, show clean full-width landing without sidebar
  if (isGuestOnLanding) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#070B16] text-slate-900 dark:text-white transition-colors duration-300">
        {children}

        {/* Global Auth / Role Selection Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <RoleSwitcherModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
        />
      </div>
    );
  }

  // Logged in user or subpage view: Full Collapsible Sidebar + Top Header
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#070B16] text-slate-900 dark:text-white transition-colors duration-300">
      {/* 1. Desktop Fixed Collapsible Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0 z-40 transition-all duration-300">
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
        />
      </div>

      {/* 2. Mobile Slide-Over Sidebar Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#0D1424] shadow-2xl z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl bg-slate-100 dark:bg-navy-850 text-slate-500 hover:text-slate-900 dark:hover:text-white z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <AppSidebar
                onOpenAuth={() => {
                  setIsMobileSidebarOpen(false);
                  setIsAuthModalOpen(true);
                }}
                onOpenRoleSwitcher={() => {
                  setIsMobileSidebarOpen(false);
                  setIsRoleModalOpen(true);
                }}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Body Container with Top Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};
