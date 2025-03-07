"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { calculateEndTime, type Booking, type BookingStatus } from "@/features/dashboard/types/booking"
// import ButtonStyles from "../../styles/Button.module.css"
import styles from "./bookingdetailsmodal.module.css"
import { useTranslation } from "react-i18next"

const API_URL = "https://mylife-api.online/"

interface BookingDetailsModalProps {
    booking: Booking;
    onClose: () => void;
    onStatusUpdate: (id: string, status: BookingStatus) => Promise<boolean>;
  }
  
  const BookingDetailsModal = ({ booking, onClose, onStatusUpdate }: BookingDetailsModalProps) => {
    const { t } = useTranslation();
    const [isUpdating, setIsUpdating] = useState(false);
  
    useEffect(() => {
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
  
      // Cleanup function to reset body overflow when modal is closed
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
  
    const handleStatusUpdate = async (newStatus: BookingStatus) => {
      setIsUpdating(true);
      try {
        const success = await onStatusUpdate(booking.id, newStatus);
        if (success) {
          onClose();
        }
      } finally {
        setIsUpdating(false);
      }
    };
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    
        if (e.currentTarget === e.target) {
          onClose();
        }
      };
  const formatStatus = (status: string): string => {
    // Translate the status to Thai or English based on the current language
    switch (status.toLowerCase()) {
      case "confirmed":
        return t("Booking.details.status.confirmed");
      case "cancelled":
        return t("Booking.details.status.cancelled");
      case "pending":
        return t("Booking.details.status.pending");
      default:
        return status; // Return the original status if no translation is found
    }
  };

  const getSlipUrl = (slipFileName: string) => {
    return `${API_URL}/uploads/${slipFileName}`
  }
  const endTime = calculateEndTime(booking.timeT1);
  return (
    
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.modalTitle}>{t("payment.details.title")}</h2>

        <div className={styles.bookingInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>{t("payment.details.customer")}:</span>
            <span className={styles.value}>{booking.fullName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>{t("payment.details.court")}:</span>
            <span className={styles.value}>{t("payment.history.court", { number: booking.courtNumber })}</span>
          </div>
            
          <div className={styles.infoRow}>
            <span className={styles.label}>{t("time")}:</span>
            <span className={styles.value}>
                {`${booking.timeT1}-${endTime}`} 
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>{t("date")}:</span>
            <span className={styles.value}>
              {booking.timeT2}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>{t("payment.details.amount")}:</span>
            <span className={styles.value}>{booking.pricing} ฿</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>{t("payment.details.status")}:</span>
            <span className={`${styles.status} ${styles[booking.status]}`}>
              {formatStatus(booking.status)}
            </span>
          </div>

          {booking.slip && (
            <div className={styles.slipSection}>
              <span className={styles.label}>{t("payment.details.slip")}:</span>
              <Image
                src={getSlipUrl(booking.slip) || "/placeholder.svg"}
                alt={t("payment.details.slipAlt")}
                width={300}
                height={400}
                className={styles.slipImage}
                unoptimized
              />
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          {booking.status === "pending" && (
            <>
              <button
                className={styles.confirmButton}
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={isUpdating}
              >
                {t("confirmed")}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={isUpdating}
              >
                {t("cancelled")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsModal

