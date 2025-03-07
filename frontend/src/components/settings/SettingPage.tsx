// "use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { SidebarNav } from "../dashboard/components/sidebar/SidebarNav"
import { Clock } from "lucide-react"
import styles from "./styles/settings.module.css"
import { BusinessHoursModal } from "./BusinessHoursModal"
import { useBusinessHours } from "@/features/settings/hooks/usebusinessHours"

const SettingPage: React.FC = () => {
  const { t } = useTranslation()
  const [activeCard, setActiveCard] = useState<"businessHours" | "bookingPolicies" | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const { fetchBusinessHours } = useBusinessHours()

  useEffect(() => {
    fetchBusinessHours()
  }, [fetchBusinessHours])

  const handleOverlayClick = () => {
    setActiveCard(null)
  }

  const settingsOptions = [
    {
      title: t("settings.businessHours.title"),
      description: t("settings.businessHours.description"),
      icon: Clock,
      type: "businessHours" as const,
    },
  ]

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={styles.container}>
      <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />

      <main
        className={styles.main}
        style={{
          marginLeft: isSidebarCollapsed ? "0" : "",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h1 className={styles.title}>{t("settings.adminManagement")}</h1>

        <div className={styles.grid}>
          {settingsOptions.map((option, index) => (
            <button key={index} className={styles.card} onClick={() => setActiveCard(option.type)}>
              <div className={styles.iconWrapper}>
                <option.icon className={styles.icon} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{option.title}</h3>
                <p className={styles.cardDescription}>{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {activeCard && (
          <div className={styles.overlay} onClick={handleOverlayClick}>
            <BusinessHoursModal isOpen={activeCard === "businessHours"} onClose={() => setActiveCard(null)} />
          </div>
        )}
      </main>
    </div>
  )
}

export default SettingPage

