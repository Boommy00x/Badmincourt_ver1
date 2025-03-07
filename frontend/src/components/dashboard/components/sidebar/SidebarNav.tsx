"use client"

import "@/styles/theme.css"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "@/components/languageswithcher/LanguageSwitcher"
import { useAuth } from "@/components/context/AuthContext"
import { useTheme } from "@/components/context/ThemeContext"
import { cn } from "@/lib/utils"
import styles from "./styles/SidebarNav.module.css"
import { TopNav } from "../topnavbar/TopNavbar"
import {
  HomeIcon,
  DocumentTextIcon,
  CogIcon,
  // BellIcon,
  CreditCardIcon,
  ClipboardIcon,
  // InformationCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftEndOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
// import { fetchCourtData } from "@/api/logonameAPI" // Import the API function

const navigationConfig = [
  { key: "nav.dashboard", href: "/dashboard", icon: HomeIcon },
  { key: "nav.reports", href: "/reports", icon: DocumentTextIcon },
  { key: "nav.courts", href: "/court-management", icon: ClipboardIcon },
  { key: "nav.payments", href: "/payments", icon: CreditCardIcon },
  // { key: "nav.notifications", href: "/notifications", icon: BellIcon },
  { key: "nav.settings", href: "/settings", icon: CogIcon },
  // { key: "nav.help", href: "/help", icon: InformationCircleIcon },
]

interface SidebarNavProps {
  toggleSidebar: () => void
  isCollapsed: boolean
}

export function SidebarNav({ toggleSidebar, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const router = useRouter();
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isCollapsed)
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  // const router = useRouter();
  const [courtName, setCourtName] = useState("")
  const [logo, setLogo] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const { logo, courtName } = JSON.parse(userData)
      setLogo(logo)
      setCourtName(courtName)
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setIsSidebarOpen(!isCollapsed)
  }, [isCollapsed])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
        toggleSidebar()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen, toggleSidebar])

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }, [isSidebarOpen])

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
        if (router) {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setIsLoading(false);
      }
    };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
    toggleSidebar()
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    toggleSidebar()
  }

  const renderUtilityGroup = () => (
    <div className={styles.utilityGroup}>
      <LanguageSwitcher isCollapsed={isCollapsed} />
      <label className={styles.themeToggle}>
        <span className={styles.toggleIcon}>
          {theme === "dark" ? <SunIcon className={styles.buttonIcon} /> : <MoonIcon className={styles.buttonIcon} />}
        </span>
        <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} className={styles.toggleInput} />
        <span className={styles.toggleSlider} />
      </label>
      <button onClick={handleLogout} disabled={isLoading} className={styles.logoutButton}>
        <ArrowLeftEndOnRectangleIcon className={styles.navIcon} />
        <span>{isLoading ? t("logout.loading") : t("nav.logout")}</span>
      </button>
    </div>
  )

  return (
    <>
       {isMobile && <TopNav onMenuClick={handleToggleSidebar} />}
      <div className={cn(styles.sidebarWrapper, { [styles.blurBackground]: !isCollapsed })}>
        <nav
          id="sidebar"
          ref={sidebarRef}
          className={cn(
            styles.sidebarNav,
            isCollapsed ? styles.collapsed : "",
            isSidebarOpen ? styles.open : "",
            theme === "dark" ? "dark" : "",
          )}
        >
          <div className={styles.sidebarTop}>
            <div className={styles.sidebarTitle}>
            <img src={logo||"/uk.png"} className={styles.logo} alt={courtName} />
              <h1 className={styles.textName}>{courtName}</h1>
            </div>
            {isMobile ? (
              <button onClick={handleCloseSidebar} className={styles.closeButton}>
                <XMarkIcon className={styles.closeIcon} />
              </button>
            ) : (
              <button
                onClick={handleToggleSidebar}
                className={styles.collapseButton}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className={styles.collapseIcon} />
                ) : (
                  <ChevronLeftIcon className={styles.collapseIcon} />
                )}
              </button>
            )}
          </div>

          <div className={styles.navItems}>
              {navigationConfig.map((item) => {
                const isActive = pathname?.replace(/\/$/, "") === item.href
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(styles.navItem, isActive ? styles.activeNavItem : styles.inactiveNavItem)}
                  onClick={isMobile ? handleCloseSidebar : undefined}
                >
                  <item.icon className={styles.navIcon} aria-hidden="true" />
                  <span className={styles.navText}>{t(item.key)}</span>
                </Link>
                )
                // console.log(cn(styles.navItem, isActive ? styles.activeNavItem : styles.inactiveNavItem))
            })}          </div>

          {!isMobile && <div className={styles.sidebarBottom}>{renderUtilityGroup()}</div>}
        </nav>
      </div>
  </>
  )
}
