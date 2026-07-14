'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  getSessionUser,
  setSessionUser,
  clearSession,
  registerUser,
  getUserDisplayName,
  setUserDisplayName,
  getAllUsers,
} from '@/utils/storage';

/* ===== Types ===== */

interface AuthUser {
  name: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
  allUsers: string[];
}

/* ===== Context ===== */

const AuthContext = createContext<AuthContextType | null>(null);

/* ===== Provider ===== */

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // On mount, restore session from sessionStorage
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      const storedUser = getSessionUser();
      if (storedUser) {
        const displayName = getUserDisplayName(storedUser);
        setUser({ name: storedUser, displayName });
      }
      setAllUsers(getAllUsers());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const login = useCallback((name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return;

    // Register user (idempotent — won't duplicate)
    registerUser(normalized);

    // Determine display name — use original casing for display
    const trimmedName = name.trim();
    const existingDisplayName = getUserDisplayName(normalized);
    const displayName = existingDisplayName !== normalized ? existingDisplayName : trimmedName;

    // Persist display name
    setUserDisplayName(normalized, displayName);

    // Set session
    setSessionUser(normalized);

    // Update state
    setUser({ name: normalized, displayName });
    setAllUsers(getAllUsers());
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: user !== null,
      login,
      logout,
      allUsers,
    }),
    [user, login, logout, allUsers],
  );

  // Avoid SSR hydration mismatch — render nothing until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, isLoggedIn: false, login: () => {}, logout: () => {}, allUsers: [] }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/* ===== Hook ===== */

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
