'use client';

import React, { createContext, useContext } from 'react';

interface AuthModalContextValue {
  openAuth: (tab: 'login' | 'register') => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const AuthModalProvider: React.FC<{ value: AuthModalContextValue; children: React.ReactNode }> = ({
  value,
  children,
}) => <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) return { openAuth: () => {} };
  return ctx;
}
