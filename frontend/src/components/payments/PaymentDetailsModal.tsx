import type React from "react"
import type { PaymentDetailsModalProps, PaymentStatus } from "@/features/payments/types/payments"
import { useTranslation } from "react-i18next"
import styles from "./styles/paymenthistory.module.css"

const API_URL = "https://mylife-api.online/"

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ payment, onClose }) => {
  const { t } = useTranslation()
 
  if (!payment) return null

  const getStatusClassName = (status: PaymentStatus) => {
    return styles[status.toLowerCase()] || styles.default
  }

  // console.log("Payment slip:", payment.slip)
  // console.log("Image URL:", `${API_URL}/uploads/${payment.slip}`)
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.modalTitle}>{t("payment.details.title")}</h2>

        <div className={styles.paymentDetails}>
          <div className={styles.detailRow}>
            <span>{t("payment.details.court")}:</span>
            <span>{payment.courtNumber}</span>
          </div>
          <div className={styles.detailRow}>
            <span>{t("payment.details.customer")}:</span>
            <span>{payment.fullName}</span>
          </div>
          <div className={styles.detailRow}>
            <span>{t("payment.details.date")}:</span>
            <span>{payment.timeT2}</span>
          </div>
          <div className={styles.detailRow}>
            <span>{t("payment.details.time")}:</span>
            <span>{payment.timeT1}</span>
          </div>
          <div className={styles.detailRow}>
            <span>{t("payment.details.status")}:</span>
            <span className={getStatusClassName(payment.status)}>
              {t(`payment.status.${payment.status.toLowerCase()}`)}
            </span>
          </div>

          <div className={styles.slipImageContainer}>
            <h3>{t("payment.details.slip")}</h3>
            {payment.slip ? (
              <img
                src={`${API_URL}/uploads/${payment.slip}`}
                alt={t("payment.details.slipAlt")}
                className={styles.slipImage}
              />
            ) : (
              <span>{t("payment.details.noSlip")}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetailsModal