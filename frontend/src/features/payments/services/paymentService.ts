// src/features/payments/services/paymentService.ts
import axios from "axios";
import type { Payment, PaymentResponse, PaymentStatus } from "../types/payments";
import Cookies from "js-cookie";

const API_URL = "https://mylife-api.online/backend";

// ฟังก์ชันสำหรับดึงข้อมูลการชำระเงิน
export async function fetchPayments(page: number, limit: number, date?: string): Promise<Payment[]> {
  try {
    const token = Cookies.get("token"); // ดึง token จากคุกกี้
    const response = await axios.post<PaymentResponse>(
      `${API_URL}/fetchHistory.php`,
      { token, date },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (Array.isArray(response.data)) {
      return response.data.map((payment: any) => ({
        id: payment.created_at,
        slip: payment.slip,
        courtNumber: payment.court_number,
        fullName: payment.full_name,
        status: mapStatus(payment.status),
        timeT1: payment.time_t1,
        timeT2: payment.time_t2,
        createdAt: payment.created_at,
        pricing: "150",
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

// ฟังก์ชันสำหรับแปลงสถานะการชำระเงิน
function mapStatus(thaiStatus: string): PaymentStatus {
  switch (thaiStatus) {
    case "อนุมัติ":
      return "completed";
    case "ไม่สำเร็จ":
      return "failed";
    default:
      return "pending";
  }
}
