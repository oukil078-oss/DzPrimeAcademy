'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { setCurrentUserDirectly } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

const ROLE_HOME: Record<string, string> = {
  OWNER: 'admin',
  ADMIN: 'admin',
  MODERATOR: 'admin',
  TEACHER: 'teacher',
  AMBASSADOR: 'ambassador',
  STUDENT_FREE: 'student',
  STUDENT_PAID: 'student',
};

export function GoogleAuthCallback() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useTranslation();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash.includes('session_id=')) return;

    processed.current = true;
    const sessionId = hash.split('session_id=')[1]?.split('&')[0];
    if (!sessionId) return;

    fetch('/api/auth/google/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUserDirectly(data.user);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        const homeRoute = ROLE_HOME[data.user.role] || 'student';
        router.replace(`/${locale}/${homeRoute}`);
      })
      .catch(() => {});
  }, [locale, router]);

  return null;
}
