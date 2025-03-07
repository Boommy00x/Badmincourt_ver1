"use client"

// import "@/styles/theme.css"
import { useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { debounce } from "@/features/settings/debounce"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useBusinessHours } from "@/features/settings/hooks/usebusinessHours"
import { useBusinessHoursUpdate } from "@/features/settings/hooks/useBusinessHoursUpdate"
import type { WeekDay, DaySchedule } from "@/features/settings/types/businessHours"
import styles from "./styles/businesshoursmodal.module.css"

interface BusinessHoursModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BusinessHoursModal: React.FC<BusinessHoursModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { businessHours, isLoading: isLoadingHours, error: fetchError, fetchBusinessHours } = useBusinessHours()
  const { updateHours, isUpdating, error: updateError } = useBusinessHoursUpdate()

  useEffect(() => {
    if (isOpen) {
      fetchBusinessHours()
    }
  }, [isOpen, fetchBusinessHours])

  const handleDayUpdate = useCallback(
    debounce(async (day: WeekDay, updates: Partial<DaySchedule>) => {
      if (!businessHours) return

      const currentDay = businessHours[day]
      const startTime = updates.start_time || currentDay.start_time
      const endTime = updates.end_time || currentDay.end_time
      const status = updates.status || currentDay.status

      // console.log(`Updating hours for ${day}:`, { startTime, endTime, status })
      const success = await updateHours(day, startTime, endTime, status)
      if (success) {
        // console.log(`Successfully updated hours for ${day}`, { status })
        fetchBusinessHours() // Refresh the data after successful update
      } else {
        console.error(`Failed to update hours for ${day}`)
      }
    }, 300),
    [businessHours, updateHours, fetchBusinessHours],
  )

  const handleClose = () => {
    onClose()
  }

  const weekDays: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <AnimatePresence>
      {isOpen && businessHours && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={styles.cardPopup}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.cardContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.cardHeader}>
                  <h3>{t("settings.businessHours.title")}</h3>
                  <button onClick={handleClose} className={styles.closeButton}>
                    <X size={24} />
                  </button>
                </div>

                {(fetchError || updateError) && <div className={styles.error}>{fetchError || updateError}</div>}

                <div className={styles.timeSettings}>
                  {weekDays.map((day) => (
                    <div key={day} className={styles.dayRow}>
                      <div className={styles.dayName}>{t(`common.days.${day.toLowerCase()}`)}</div>

                      <div className={styles.timeInputs}>
                        {businessHours[day].status === "Active" && (
                          <>
                            <input
                              type="time"
                              value={businessHours[day].start_time}
                              onChange={(e) => handleDayUpdate(day, { start_time: e.target.value })}
                              className={styles.timeInput}
                              disabled={isUpdating}
                              style={{ fontSize: "16px", padding: "8px" }}
                            />
                            <div className={styles.keed}>-</div>
                            <input
                              type="time"
                              value={businessHours[day].end_time}
                              onChange={(e) => handleDayUpdate(day, { end_time: e.target.value })}
                              className={styles.timeInput}
                              disabled={isUpdating}
                              style={{ fontSize: "16px", padding: "8px" }}
                            />
                          </>
                        )}

                        <label className={`${styles.switch} ${isLoadingHours || isUpdating ? styles.disabled : ""}`}>
                          <input
                            type="checkbox"
                            checked={businessHours[day].status === "Active"}
                            onChange={(e) => handleDayUpdate(day, { status: e.target.checked ? "Active" : "Inactive" })}
                            disabled={isLoadingHours || isUpdating}
                          />
                          <span className={styles.slider} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

