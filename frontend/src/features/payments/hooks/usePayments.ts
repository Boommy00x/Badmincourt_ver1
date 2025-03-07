// src/features/payments/hooks/usePayments.ts
import { useState, useCallback } from "react";
import { fetchPayments } from "../services/paymentService";
import type { Payment } from "../types/payments";

// Hook สำหรับจัดการสถานะและการดึงข้อมูลการชำระเงิน
export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  // ฟังก์ชันสำหรับดึงข้อมูลการชำระเงิน
  const loadPayments = useCallback(async (page = 1, date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPayments(page, itemsPerPage, date);
      setPayments(data);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      console.error("เกิดข้อผิดพลาดใน usePayments hook:", err);
      setError("ไม่สามารถโหลดข้อมูลการชำระเงินได้");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ฟังก์ชันสำหรับลองโหลดข้อมูลใหม่
  const retryLoadPayments = useCallback(() => {
    loadPayments(currentPage);
  }, [loadPayments, currentPage]);

  return {
    payments,
    isLoading,
    error,
    loadPayments,
    retryLoadPayments,
    currentPage,
    totalPages,
    itemsPerPage,
  };
}
