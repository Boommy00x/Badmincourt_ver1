import { LoginCredentials, AuthResponse , AuthError} from '../types/auth';
import {User} from '../types/user';
import axios from "axios";

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  
  async login(credentials: LoginCredentials) {
    try {
      const url = "https://mylife-api.online/backend/login.php";
      const payload = {
        username: credentials.username,
        password: credentials.password,
      };
  
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data; // Ensure this returns the full response data
  
    } catch (error: any) {
      console.error('Login process failed:', error);
      throw new Error(error.response?.data?.message || 'Unable to complete login process');
    }
  }
  
  // async logout(): Promise<void> {
  //   try {
  //     const response = await fetch('/api/logout', {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('Logout failed');
  //     }

  //     // Clear local storage and memory
  //     localStorage.removeItem('auth_token');
  //     localStorage.removeItem('user');
  //     this.token = null;
  //     this.user = null;
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     throw new Error('Logout failed');
  //   }
  // }

  // async checkAuth(): Promise<{ isAuthenticated: boolean; user: User | null }> {
  //   try {
  //     const response = await fetch('/pages/api/check-auth', {
  //       method: 'GET',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Cache-Control': 'no-cache',
  //       },
  //     });

  //     if (!response.ok) {
  //       return { isAuthenticated: false, user: null };
  //     }

  //     const data = await response.json();

  //     if (data.success && data.user) {
  //       this.user = data.user;
  //       return { isAuthenticated: true, user: data.user };
  //     }

  //     return { isAuthenticated: false, user: null };
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     return { isAuthenticated: false, user: null };
  //   }
  // }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

}
export const authService = AuthService.getInstance(); //ไอเดีย ซิงเกอร์ดั้น