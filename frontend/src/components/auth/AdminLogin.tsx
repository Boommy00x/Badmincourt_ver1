'use client';
import "@/styles/theme.css"
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import styles from './styles/AdminLogin.module.css';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/context/NotificationContext';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface AdminLoginProps {
  onLoginSuccess?: () => void;
  redirectTo?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  redirectTo = '/dashboard',
}) => {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const { notify } = useNotification();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add Safari-specific class to the body
    if (typeof window !== "undefined") {
      document.body.classList.add(styles.safariBody);
    }

    // Load saved username and password from localStorage
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername, rememberMe: true }));
    }
    if (savedPassword) {
      setFormData((prev) => ({ ...prev, password: savedPassword }));
    }

    if (user && !loading) {
      router.push(redirectTo);
      notify("Login successful!", "success");
    }

    return () => {
      // Remove Safari-specific class from the body
      if (typeof window !== "undefined") {
        document.body.classList.remove(styles.safariBody);
      }
    };
  }, [user, loading, router, redirectTo, notify]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username && !formData.password) {
      setError('กรุณาระบุบัญชีผู้ใช้และรหัสผ่าน');
      return;
    }
    if (!formData.username) {
      setError('กรุณาระบุบัญชีผู้ใช้');
      return;
    }
    if (!formData.password) {
      setError('กรุณาระบุรหัสผ่าน');
      return;
    }

    try {
      const success = await login({ username: formData.username, password: formData.password });
      if (success) {
        // Save username and password to localStorage if rememberMe is checked
        if (formData.rememberMe) {
          localStorage.setItem('savedUsername', formData.username);
          localStorage.setItem('savedPassword', formData.password);
        } else {
          localStorage.removeItem('savedUsername');
          localStorage.removeItem('savedPassword');
        }
        router.push(redirectTo);
        notify("เข้าสู่ระบบสำเร็จ!!", "success");
      } else {
        setError('รหัสผ่านไม่ถูกต้องหรือบัญชีผู้ใช้ไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด');
      notify("An error occurred during login. Please try again.", "error");
    }
  };

  return (
    <div className={`${styles.container} ${styles.safariContainer}`}>
      <div className={`${styles.decorativeCircle} ${styles.decorativeCircleBottom}`} />
      <div className={`${styles.decorativeCircle} ${styles.decorativeCircleTop}`} />
      <div className={`${styles.formContainer} ${styles.safariFormContainer}`}>
        <div className={styles.header}>
          <img src={"/shuttle.png"} className={styles.logo} width={100} height={100} />
          <h1 className={styles.title}>ADMIN LOGIN BADMIN COURT</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter Username"
              className={styles.input}
            />
            <User className={styles.inputIcon} />
          </div>
          <div className={styles.inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
            >
              {showPassword ? <EyeOff className={styles.inputIcon} /> : <Eye className={styles.inputIcon} />}
            </button>
          </div>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            <label htmlFor="rememberMe" className={styles.checkboxLabel}>Remember Me</label>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
