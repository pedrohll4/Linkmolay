import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole, UserStatus } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  status: UserStatus | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isPending: boolean;
  isAdmin: boolean;
  isMason: boolean;
  isDeMolay: boolean;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Parameters<typeof api.register>[0]) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
  switchAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string) => {
    try {
      const res = api.login(email);
      if (res.error) {
        return { success: false, error: res.error };
      }
      refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao realizar login.' };
    }
  };

  const register = async (data: Parameters<typeof api.register>[0]) => {
    try {
      api.register(data);
      refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao realizar cadastro.' };
    }
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const switchAccount = (userId: string) => {
    api.setCurrentUser(userId);
    refreshUser();
  };

  const role = currentUser?.role || null;
  const status = currentUser?.status || null;
  const isAuthenticated = Boolean(currentUser);
  const isApproved = status === 'approved';
  const isPending = status === 'pending';
  const isAdmin = role === 'admin';
  const isMason = role === 'mason';
  const isDeMolay = role === 'demolay';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        status,
        isAuthenticated,
        isApproved,
        isPending,
        isAdmin,
        isMason,
        isDeMolay,
        loading,
        login,
        register,
        logout,
        refreshUser,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
