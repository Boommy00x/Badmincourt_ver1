import { useState, useEffect, useCallback, useMemo } from "react"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SidebarNav } from "../../components/dashboard/components/sidebar/SidebarNav"
import { CourtEditModal } from "./CourtEditModal"
import { useFetchCourts } from "@/features/court-management/hooks/useFetchCourt"
import type { Court } from "@/features/court-management/types/court"
import styles from "./styles/courtmanage.module.css"

export default function CourtManagement() {
  const { t } = useTranslation()
  const { courts: fetchedCourts, isLoading, error, fetchCourts } = useFetchCourts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [localCourts, setLocalCourts] = useState<Court[]>([])
  const [logo, setLogo] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const { logo } = JSON.parse(userData)
      setLogo(logo)
    }
  }, [])

  useEffect(() => {
    fetchCourts()
  }, [fetchCourts])

  useEffect(() => {
    if (fetchedCourts) {
      setLocalCourts(fetchedCourts)
    }
  }, [fetchedCourts])

  const courts = useMemo(() => {
    return localCourts.map((court) => {
      const hasOpenDays = Object.values(court.schedule).some((day) => day.isOpen)
      return {
        ...court,
        status: hasOpenDays ? "Active" : "Inactive",
      } as Court
    })
  }, [localCourts])

  const selectedCourt = useMemo(
    () => courts.find((court) => court.id === selectedCourtId) || null,
    [courts, selectedCourtId],
  )

  const handleCourtUpdate = useCallback((updatedCourt: Court) => {
    setLocalCourts((prevCourts) => prevCourts.map((court) => (court.id === updatedCourt.id ? updatedCourt : court)))
  }, [])

  const handleModalClose = useCallback(() => {
    setSelectedCourtId(null)
  }, [])

  const filteredCourts = useMemo(
    () => courts.filter((court) => court.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [courts, searchQuery],
  )

  const handleCourtClick = useCallback((court: Court) => {
    setSelectedCourtId(court.id)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  // if (isLoading) {
  //   return <div className={styles.loading}>{t("loading")}</div>
  // }

  if (error) {
    return (
      <div className={styles.error}>
        {t("error")}: {error}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
      <main className={`${styles.main} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
        <h1 className={styles.title}>{t("courtsmanagement")}</h1>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("courtName")}</th>
                <th>{t("images")}</th>
                <th>{t("status")}</th>
                <th>{t("price")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourts.map((court) => (
                <tr
                  key={court.id}
                  onClick={() => handleCourtClick(court)}
                  className={styles.tableRow}
                  role="button"
                  tabIndex={0}
                >
                  <td>{t(court.name)}</td>
                  <td>
                  {logo && <img src={logo||"/uk.png"} className={styles.courtImage} alt={court.name} />}
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[court.status.toLowerCase()]}`}>
                      {t(court.status.toLowerCase())}
                    </span>
                  </td>
                  <td>{court.pricing} ฿</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCourt && (
          <CourtEditModal
            key={selectedCourt.id}
            court={selectedCourt}
            onClose={handleModalClose}
            onUpdate={handleCourtUpdate}
          />
        )}
      </main>
    </div>
  )
}
