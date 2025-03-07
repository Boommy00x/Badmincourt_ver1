import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { SidebarNav } from "../dashboard/components/sidebar/SidebarNav";
import styles from "./styles/paymenthistory.module.css";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { usePayments } from "../../features/payments/hooks/usePayments";
import type { Payment, PaymentStatus } from "@/features/payments/types/payments";
import { useTranslation } from "react-i18next";
import PaymentFilters from "@/components/payments/ui/fillter";

const PaymentHistory: React.FC = () => {
  const { payments, isLoading, error, loadPayments, retryLoadPayments, currentPage, totalPages } = usePayments();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<{ date?: string, status?: string }>({});
  const [logo, setLogo] = useState<string>("");

  // Fetch logo from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { logo } = JSON.parse(userData);
      setLogo(logo);
    }
  }, []);

  useEffect(() => {
    loadPayments(currentPage, filters.date);
  }, [loadPayments, currentPage, filters]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handlePageChange = (page: number) => {
    loadPayments(page, filters.date);
  };

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleFilterChange = (newFilters: { date?: string, status?: string }) => {
    setFilters(newFilters);
  };

  const filteredPayments = payments.filter((payment) => {
    if (filters.status && payment.status !== filters.status) {
      return false;
    }
    if (filters.date && payment.timeT2 !== filters.date) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort by timeT2 in descending order
    return new Date(b.timeT2).getTime() - new Date(a.timeT2).getTime();
  });

  const paginatedPayments = filteredPayments.slice((currentPage - 1) * 10, currentPage * 10);

  const getStatusClassName = (status: PaymentStatus) => {
    return styles[status.toLowerCase()] || styles.default;
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          {t("error")}: {error}
        </div>
        <button onClick={retryLoadPayments} className={styles.retryButton}>
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
      <main className={`${styles.main} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
        <h1 className={styles.title}>{t("payment.history.title")}</h1>
        <div className={styles.filterContainer}>
          <PaymentFilters onFilterChange={handleFilterChange} />
        </div>
        <div className={styles.paymentList}>
          {paginatedPayments.map((payment) => (
            <div key={payment.id} className={styles.paymentItem} onClick={() => handlePaymentClick(payment)}>
              <div className={styles.paymentInfo}>
                <div className={styles.imageWrapper}>
                  <img src={logo || "/shuttle.png"} alt={t("payment.history.shuttleImage")} className={styles.image} />
                </div>
                <div className={styles.details}>
                  <h3 className={styles.paymentTitle}>
                    {t("payment.history.court", { number: payment.courtNumber })}
                  </h3>
                  <p className={styles.paymentDate}>{payment.timeT2}</p>
                  <p className={styles.customerName}>{payment.fullName}</p>
                </div>
              </div>
              <div className={`${styles.status} ${getStatusClassName(payment.status)}`}>
                {t(`payment.status.${payment.status.toLowerCase()}`)}
              </div>
            </div>
          ))}
        </div>
        {filteredPayments.length > 10 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationArrow}
              aria-label={t("pagination.previous")}
            >
              <ChevronLeftIcon className={styles.icon} />
            </button>
            {Array.from({ length: Math.ceil(filteredPayments.length / 10) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ""}`}
                aria-label={t("pagination.page", { page })}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredPayments.length / 10)}
              className={styles.paginationArrow}
              aria-label={t("pagination.next")}
            >
              <ChevronRightIcon className={styles.icon} />
            </button>
          </div>
        )}
        {selectedPayment && <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />}
      </main>
    </div>
  );
};

export default PaymentHistory;
