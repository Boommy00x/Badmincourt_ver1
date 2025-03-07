'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials } from '@/features/auth/types/auth';
import { User } from '@/features/auth/types/user';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    loading: boolean;
  }
  
  export const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          
          if (data.valid) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            // Clear invalid token
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const login = async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
  
        if (response.ok && data.token) {
          // Store token
          localStorage.setItem('auth_token', data.token);
          
          // Update state
          setIsAuthenticated(true);
          setUser(data.user);
  
          // Redirect to dashboard
          router.push('/dashboard');
          return true;
        }
  
        return false;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    const logout = async (): Promise<void> => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear local state regardless of API call success
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        router.push('/auth');
      }
    };
  
    const value = {
      isAuthenticated,
      user,
      login,
      logout,
      loading
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  export const useAuth= () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };