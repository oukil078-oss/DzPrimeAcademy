'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  User,
  Role,
  PackEnrollment,
  ModuleResource,
  TeacherRosterStudent,
} from '@/types';
import {
  DEMO_USERS,
  INITIAL_ENROLLMENTS,
  MODULE_RESOURCES,
  SAMPLE_ROSTER_STUDENTS,
} from './initial-data';

const STORAGE_KEY_USER = 'dz_prime_current_user';
const STORAGE_KEY_ENROLLMENTS = 'dz_prime_enrollments';
const STORAGE_KEY_RESOURCES = 'dz_prime_resources';
const STORAGE_KEY_ROSTER = 'dz_prime_roster';

// --- Singleton Auth & State Instances ---
let currentUserInstance: User | null = null;
let enrollmentsInstance: PackEnrollment[] = INITIAL_ENROLLMENTS;
let resourcesInstance: ModuleResource[] = MODULE_RESOURCES;
let rosterInstance: TeacherRosterStudent[] = SAMPLE_ROSTER_STUDENTS;

const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach((listener) => listener());
}

function getStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return fallback;
}

// Initialize from LocalStorage
if (typeof window !== 'undefined') {
  currentUserInstance = getStoredJson<User | null>(STORAGE_KEY_USER, null);
  enrollmentsInstance = getStoredJson<PackEnrollment[]>(
    STORAGE_KEY_ENROLLMENTS,
    INITIAL_ENROLLMENTS
  );
  resourcesInstance = getStoredJson<ModuleResource[]>(
    STORAGE_KEY_RESOURCES,
    MODULE_RESOURCES
  );
  rosterInstance = getStoredJson<TeacherRosterStudent[]>(
    STORAGE_KEY_ROSTER,
    SAMPLE_ROSTER_STUDENTS
  );
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// =====================================
// AUTH STORE
// =====================================
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
  notifyAll();
}

export function useAuthStore() {
  const currentUser = useSyncExternalStore(
    subscribe,
    () => currentUserInstance,
    () => null
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
    setUser,
    switchRole,
    signOut,
    logout: signOut,
    upgradeToGolden,
    isLoaded: true,
    isAuthenticated: !!currentUser,
  };
}

// =====================================
// ENROLLMENTS & DAWARAT STORE
// =====================================
function notifyEnrollmentChange(newEnrollments: PackEnrollment[]) {
  enrollmentsInstance = newEnrollments;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY_ENROLLMENTS,
        JSON.stringify(newEnrollments)
      );
    } catch (e) {}
  }
  notifyAll();
}

export function useEnrollmentStore() {
  const enrollments = useSyncExternalStore(
    subscribe,
    () => enrollmentsInstance,
    () => INITIAL_ENROLLMENTS
  );

  const addEnrollment = useCallback((enrollment: PackEnrollment) => {
    const updated = [enrollment, ...enrollmentsInstance];
    notifyEnrollmentChange(updated);
  }, []);

  const getStudentEnrollments = useCallback(
    (studentId?: string) => {
      if (!studentId) return enrollmentsInstance;
      return enrollmentsInstance.filter(
        (e) => e.studentId === studentId || e.studentId === 'user-student-gold'
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enrollments]
  );

  return {
    enrollments,
    addEnrollment,
    getStudentEnrollments,
  };
}

// =====================================
// TEACHER RESOURCES & ROSTER STORE
// =====================================
function notifyResourcesChange(newResources: ModuleResource[]) {
  resourcesInstance = newResources;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(newResources));
    } catch (e) {}
  }
  notifyAll();
}

function notifyRosterChange(newRoster: TeacherRosterStudent[]) {
  rosterInstance = newRoster;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(newRoster));
    } catch (e) {}
  }
  notifyAll();
}

export function useTeacherStore() {
  const resources = useSyncExternalStore(
    subscribe,
    () => resourcesInstance,
    () => MODULE_RESOURCES
  );

  const roster = useSyncExternalStore(
    subscribe,
    () => rosterInstance,
    () => SAMPLE_ROSTER_STUDENTS
  );

  const addResource = useCallback((resource: ModuleResource) => {
    const updated = [resource, ...resourcesInstance];
    notifyResourcesChange(updated);
  }, []);

  const deleteResource = useCallback((resourceId: string) => {
    const updated = resourcesInstance.filter((r) => r.id !== resourceId);
    notifyResourcesChange(updated);
  }, []);

  const updateAttendance = useCallback(
    (studentId: string, status: 'ACTIVE' | 'EXCUSED' | 'ABSENT') => {
      const updated = rosterInstance.map((s) =>
        s.id === studentId ? { ...s, status } : s
      );
      notifyRosterChange(updated);
    },
    []
  );

  return {
    resources,
    roster,
    addResource,
    deleteResource,
    updateAttendance,
  };
}
