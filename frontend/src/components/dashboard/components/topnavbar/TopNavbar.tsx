"use client";

import "@/styles/theme.css";
import { Bars3Icon, SunIcon, MoonIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import styles from "./topnavbar.module.css";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/context/AuthContext";
import { useTheme } from "@/components/context/ThemeContext";
import { LanguageSwitcher } from "@/components/languageswithcher/LanguageSwitcher";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie"; // นำเข้า js-cookie
import { useRouter } from "next/navigation"; // นำเข้า useRouter

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const router = useRouter(); // ใช้ useRouter สำหรับการ Redirect

  const handleScroll = debounce(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 20) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  }, 15);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { logo } = JSON.parse(userData);
      setLogo(logo);
    }
  }, []);

  const handleLogout = async () => {
    if (!window.confirm(t("logout.confirmMessage"))) return; // ยืนยันการ Logout
    setIsLoading(true);

    try {
      await logout(); // เรียกฟังก์ชัน logout จาก useAuth

      // ลบคุกกี้ทั้งหมด
      Cookies.remove("token"); // ลบคุกกี้ token
      Cookies.remove("court_name"); // ลบคุกกี้ ชื่อ
      Cookies.remove("logo"); // ลบคุกกี้ โลโก้
      // ลบข้อมูลใน localStorage (ถ้ามี)
      localStorage.removeItem("user");

      // Redirect ไปยังหน้า Login
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className={cn(styles.topNav, isVisible ? styles.visible : styles.hidden, theme === "dark" ? styles.dark : "")}>
      <button onClick={onMenuClick} className={styles.menuButton} aria-label="Toggle menu">
        <Bars3Icon className={styles.menuIcon} />
      </button>
      <div className={styles.logo}>
        <img src={logo || "/uk.png"} className={styles.logo} alt="Logo" />
      </div>
      <div className={styles.rightIcons}>
        <LanguageSwitcher isCollapsed={false} />
        <button onClick={toggleTheme} className={styles.iconButton} aria-label="Toggle theme">
          {theme === "dark" ? <SunIcon className={styles.icon} /> : <MoonIcon className={styles.icon} />}
        </button>
        <button onClick={handleLogout} disabled={isLoading} className={styles.iconButton} aria-label="Logout">
          <ArrowLeftOnRectangleIcon className={styles.icon} />
        </button>
      </div>
    </nav>
  );
}