import type { BookingData } from "../types/reports"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend/fetchHistory.php"

export const fetchBookingData = async (): Promise<BookingData[]> => {
  try {
    const token = Cookies.get("token")
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "fetch",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch booking data: ${response.status} ${errorText}`)
    }

    const data: BookingData[] = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching booking data:", error)
    throw error
  }
}
