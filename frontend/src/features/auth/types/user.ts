export interface User {
    id: string;
    username: string;
    email?: string;
    role: 'admin';
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    preferences?: {
      theme?: 'light' | 'dark';
      language?: string;
    };
  }