import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { loginUser, registerUser } from '../services/api.ts';

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  switchDemoUser: (role: 'citizen' | 'admin') => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const DEFAULT_CITIZEN: User = {
  id: 'usr_citizen_01',
  name: 'Rahul Sharma',
  email: 'citizen@civicfix.org',
  phone: '+91 98765 43210',
  city: 'Bengaluru',
  preferredLanguage: 'English',
  role: 'citizen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
};

const DEFAULT_ADMIN: User = {
  id: 'usr_admin_01',
  name: 'Officer Priya Verma',
  email: 'admin@civicfix.org',
  phone: '+91 98450 11223',
  city: 'Bengaluru',
  preferredLanguage: 'English',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('civicfix_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CITIZEN;
      }
    }
    return DEFAULT_CITIZEN;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('civicfix_auth') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    localStorage.setItem('civicfix_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('civicfix_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchDemoUser = async (role: 'citizen' | 'admin') => {
    const target = role === 'admin' ? DEFAULT_ADMIN : DEFAULT_CITIZEN;
    try {
      const res = await loginUser(target.email);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
    } catch {
      setCurrentUser(target);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setCurrentUser(DEFAULT_CITIZEN);
    setIsAuthenticated(false);
    localStorage.removeItem('civicfix_auth');
  };

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        switchDemoUser,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
