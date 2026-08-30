'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { User } from '@/types';

let currentUser: User | null = null;
let authChecked = false;
let checkPromise: Promise<void> | null = null;
let snapshot: { currentUser: User | null; authChecked: boolean } = { currentUser, authChecked };
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return snapshot;
}

const SERVER_SNAPSHOT = { currentUser: null, authChecked: false };

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function notify() {
  snapshot = { currentUser, authChecked };
  listeners.forEach((l) => l());
}

function setUser(user: User | null) {
  currentUser = user;
  authChecked = true;
  notify();
}

async function checkAuth(): Promise<void> {
  if (typeof window !== 'undefined' && window.location.hash.includes('session_id=')) {
    // Defer to GoogleAuthCallback, which will populate the store itself.
    authChecked = true;
    notify();
    return;
  }
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
    } else {
      currentUser = null;
    }
  } catch (e) {
    currentUser = null;
  }
  authChecked = true;
  notify();
}

export function refreshAuth() {
  checkPromise = null;
  return checkAuth();
}

export function setCurrentUserDirectly(user: User | null) {
  setUser(user);
}

export function useAuthStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!checkPromise) {
      checkPromise = checkAuth();
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'فشل تسجيل الدخول' };
    }
    setUser(data.user);
    return { success: true, user: data.user as User };
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string; wilayaCode?: number; wilayaName?: string }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'فشل إنشاء الحساب' };
      }
      setUser(data.user);
      return { success: true, user: data.user as User };
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setUser(null);
  }, []);

  const upgradeToGolden = useCallback(async () => {
    const res = await fetch('/api/account/upgrade', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  }, []);

  const updateProfile = useCallback(async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  }, []);

  return {
    currentUser: snapshot.currentUser,
    isLoaded: snapshot.authChecked,
    isAuthenticated: !!snapshot.currentUser,
    login,
    register,
    signOut,
    upgradeToGolden,
    updateProfile,
    setCurrentUser: setUser,
  };
}
