'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { LearnifyDashboard } from '@/components/dashboard/LearnifyDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HomePage() {
  const { locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // While mounting or if guest/visitor: Show the full modern Landing Page without sidebar
  if (!isMounted || !currentUser) {
    return (
      <>
        <LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Role-specific main home view
  if (currentUser.role === 'TEACHER') {
    return (
      <div className="w-full pb-16 font-arabic select-none">
        <TeacherDashboard />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Default: Student Dashboard
  return (
    <div className="w-full pb-16 font-arabic select-none">
      <LearnifyDashboard />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
