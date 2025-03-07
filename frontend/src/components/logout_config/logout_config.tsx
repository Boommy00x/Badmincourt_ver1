"use client"

import { useEffect, useState } from "react"
// import { X } from "lucide-react"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "./logout.module.css"

interface LogoutConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutConfirmation({ isOpen, onClose, onConfirm }: LogoutConfirmationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      {/* <Card className={`${styles.card} ${isVisible ? styles.cardVisible : ""}`}>
        <CardHeader>
          <CardTitle id="logout-title" className="text-lg font-semibold">
            ยืนยันการออกจากระบบ
          </CardTitle>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">คุณต้องการออกจากระบบจริงหรือไม่?</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <button onClick={onClose} className={`${styles.buttonBase} ${styles.cancelButton}`}>
            ยกเลิก
          </button>
          <button onClick={onConfirm} className={`${styles.buttonBase} ${styles.confirmButton}`}>
            ยืนยัน
          </button>
        </CardFooter>
      </Card> */}
    </div>
  )
}

