import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { Closure } from "@/features/court-management/types/court"
import styles from "./styles/closuredialog.module.css"

interface ClosureDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (closure: Closure) => void
}

export const ClosureDialog: React.FC<ClosureDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const { t } = useTranslation()
  const [lock_start, setLockStart] = useState("")
  const [lock_end, setLockEnd] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!lock_start || !lock_end) {
      setError(t("Please enter both start and end times"))
      return
    }
    setError("")
    onAdd({ lock_start, lock_end })
    setLockStart("")
    setLockEnd("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className={styles.dialog}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <h2 className={styles.title}>{t("addClosure")}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="lock_start" className={styles.label}>
                  {t("startTime")}
                </label>
                <Input
                  id="lock_start"
                  type="time"
                  value={lock_start}
                  onChange={(e) => setLockStart(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lock_end" className={styles.label}>
                  {t("endTime")}
                </label>
                <Input
                  id="lock_end"
                  type="time"
                  value={lock_end}
                  onChange={(e) => setLockEnd(e.target.value)}
                  className={styles.input}
                />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.buttonGroup}>
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("Booking.details.status.cancelled")}
                </Button>
                <Button type="submit">{t("add")}</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

