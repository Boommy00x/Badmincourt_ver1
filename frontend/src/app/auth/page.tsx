"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import AdminLogin from '@/components/auth/AdminLogin';
import BadmintonLoader from '@/components/loader/badmintonLoader';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter สำหรับการนำทาง

const LoginPage = () => {
  const { loading, isAuthenticated } = useAuth(); // ดึง loading และ isAuthenticated จาก useAuth
  const [fadeIn, setFadeIn] = useState(false); // สถานะสำหรับควบคุมการ fade-in
  const router = useRouter(); // สร้าง router

  useEffect(() => {
    if (isAuthenticated()) {
      // หากผู้ใช้เข้าสู่ระบบแล้ว ให้เปลี่ยนเส้นทางไปยังหน้า dashboard
      router.push('/dashboard');
    } else if (!loading) {
      // ตั้งค่า fadeIn เป็น true เมื่อการโหลดเสร็จสิ้น
      setFadeIn(true);
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BadmintonLoader /> {/* แสดง loader ขณะกำลังโหลด */}
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div
        style={{
          opacity: fadeIn ? 1 : 0, // เปลี่ยนค่า opacity ตามสถานะ fadeIn
          transition: 'opacity 0.5s ease-in-out', // ตั้งค่าการเปลี่ยนแปลง opacity
        }}
      >
        <AdminLogin onLoginSuccess={function (): void {
          throw new Error('Function not implemented.'); // ฟังก์ชันที่ยังไม่ได้ทำการ implement
        }} />
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0; // เริ่มต้นที่ opacity 0
          }
          to {
            opacity: 1; // สิ้นสุดที่ opacity 1
          }
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
