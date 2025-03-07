import { User } from "@/features/auth/types/user";

export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
  }
  
  export interface AuthError {
    code: string;
    message: string;
  }


  export interface LoginResponse {
      success: boolean;
      token: string;
      user: User;
      message?: string;
    }
    