import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiGetMe, apiLogout, hasToken, UserData } from '@/lib/api';

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    if (!hasToken()) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }
    apiGetMe()
      .then(({ user }) => {
        setState({ user, isLoading: false, isAuthenticated: true, error: null });
      })
      .catch(() => {
        apiLogout();
        setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const { user } = await apiLogin(email, password);
      setState({ user, isLoading: false, isAuthenticated: true, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setState(s => ({ ...s, isLoading: false, error: msg }));
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const { user } = await apiRegister(email, password, name);
      setState({ user, isLoading: false, isAuthenticated: true, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setState(s => ({ ...s, isLoading: false, error: msg }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
