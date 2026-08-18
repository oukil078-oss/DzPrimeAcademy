'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { User, Role } from '@/types';
import { DEMO_USERS } from './initial-data';

const STORAGE_KEY_USER = 'dz_prime_current_user';

// --- Singleton Auth / Role Store ---
let currentUserInstance: User | null = null;
const userListeners = new Set<() => void>();

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Initialize on browser load
if (typeof window !== 'undefined') {
  currentUserInstance = getStoredUser();
}

function subscribeUser(callback: () => void) {
  userListeners.add(callback);
  return () => {
    userListeners.delete(callback);
  };
}

function getUserSnapshot(): User | null {
  return currentUserInstance;
}

function getUserServerSnapshot(): User | null {
  return null;
}

function notifyUserChange(newUser: User | null) {
  currentUserInstance = newUser;
  if (typeof window !== 'undefined') {
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {}
  }
  userListeners.forEach((listener) => listener());
}

export function useAuthStore() {
  const currentUser = useSyncExternalStore(
    subscribeUser,
    getUserSnapshot,
    getUserServerSnapshot
  );

  const setUser = useCallback((user: User | null) => {
    notifyUserChange(user);
  }, []);

  const switchRole = useCallback((role: Role) => {
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      notifyUserChange(matched);
    }
  }, []);

  const signOut = useCallback(() => {
    notifyUserChange(null);
  }, []);

  const upgradeToGolden = useCallback(() => {
    if (!currentUserInstance) {
      // If guest upgrades, create a VIP student account
      const newVipUser: User = {
        id: `user-${Date.now()}`,
        email: 'vip.student@dzprime.academy',
        name: 'VIP Student',
        role: 'STUDENT_PAID',
        wilayaCode: 16,
        wilayaName: 'Alger',
        institutionName: 'Université USTHB Bab Ezzouar',
        specialty: 'Informatique & Ingénierie',
        studentCardId: `DZ-GLD-16-${Math.floor(1000 + Math.random() * 9000)}`,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      notifyUserChange(newVipUser);
      return;
    }

    const updated: User = {
      ...currentUserInstance,
      role: 'STUDENT_PAID',
      studentCardId:
        currentUserInstance.studentCardId ||
        `DZ-GLD-${currentUserInstance.wilayaCode || 16}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
      isVerified: true,
    };
    notifyUserChange(updated);
  }, []);

  return {
    currentUser,
    setCurrentUser: setUser,
    switchRole,
    signOut,
    upgradeToGolden,
    isLoaded: true,
    isAuthenticated: !!currentUser,
  };
}

