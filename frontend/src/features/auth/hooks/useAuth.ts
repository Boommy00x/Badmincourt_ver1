import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { LoginCredentials } from '../types/auth';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.status === "success") {
        // Store token and user data in cookies
        Cookies.set('token', response.token);
        Cookies.set('court_name', response.data.court_name);
        Cookies.set('logo', response.data.logo);

        // Optionally, store user data in local storage
        localStorage.setItem('user', JSON.stringify({
          courtName: response.data.court_name,
          logo: response.data.logo
        }));

        return true;
      }

      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  // const logout = async () => {
  //   try {
  //     await authService.logout();
  //     setUser(null);
  //     setError(null);
  //   } catch (error) {
  //     setError('Logout failed');
  //     throw error;
  //   }
  // };

  // Check if the user is authenticated based on the presence of a token
  const isAuthenticated = () => {
    return !!Cookies.get('token');
  };

  return {
    user,
    loading,
    error,
    login,
    // logout,
    isAuthenticated,
  };
}
