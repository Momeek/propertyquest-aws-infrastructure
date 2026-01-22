'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentAdminStore } from '@/store/auth.store';
import { AdminAttr } from '@/interfaces/admin.interface';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  user: AdminAttr | null;
  login: (adminData: { admin: AdminAttr; token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string; // Add loading state to context
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    logout: adminLogOut,
    setAdmin,
    setToken,
    admin,
  } = useCurrentAdminStore();
  const [user, setUser] = useState<AdminAttr | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();
  const pathname = usePathname();

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)'),
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const token =
    typeof document !== 'undefined' ? getCookie('admin_user') || '' : '';

  useEffect(() => {
    if (admin) {
      try {
        setUser(admin);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    adminLogOut();
    setUser(null);
    document.cookie =
      'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  useEffect(() => {
    if (!isLoading) {
      // If not loading and no user, redirect to login if not already there
      if ((!user || !token) && pathname !== '/login') {
        document.cookie =
          'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
      }
      // If token exists but is expired, log out and redirect to login
      if (pathname !== '/login' && token) {
        try {
          const decodedToken = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000; // Convert to seconds
          // Check if token is expired
          if (decodedToken.exp < currentTime) {
            logout();
            return;
          }
        } catch (error: unknown) {
          console.error('Error parsing token:', error);
          logout();
          return;
        }
      }
      // Only redirect if we're sure about the auth state
      if (!token && pathname !== '/login') {
        router.push('/login');
      } else if (token && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [user, pathname, isLoading, router, token]);

  const login = (adminData: { admin: AdminAttr; token: string }) => {
    setUser(adminData.admin || null);
    setAdmin(adminData.admin || ({} as AdminAttr));
    setToken(adminData.token || '');
    document.cookie = `admin_user=${JSON.stringify(adminData.token)}; path=/; max-age=86400`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        isAuthenticated: !!user,
        isLoading, // Provide loading state to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}
