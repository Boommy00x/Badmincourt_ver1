import axios from "axios"
import type { BookingResponse, BookingStatus } from "../types/booking"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend"

const bookingService = {
  getAllBookings: async (): Promise<BookingResponse> => {
    const token = Cookies.get("token")
    const response = await axios.get(`${API_URL}/booking.php`, {
      params: {
        token: token,
        type: "fetch",
      },
    })

    // Check if response.data is an array
    const bookingsData = Array.isArray(response.data) ? response.data : [];

    return {
      success: true,
      data: bookingsData.map((booking: any) => ({
        ...booking,
        created_at: booking.created_at || new Date().toISOString(),
      })),
    }
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<BookingResponse> => {
    const token = Cookies.get("token")
    const statusMap: Record<BookingStatus, string> = {
      confirmed: "confirmed",
      cancelled: "cancelled",
      pending: "pending",
    }

    const response = await axios.get(`${API_URL}/update_booking.php`, {
      params: {
        token: token,
        type: statusMap[status],
        id: id,
      },
    })

    return {
      success: response.data.status === "ok",
      data: response.data,
    }
  },
}

export default bookingService
