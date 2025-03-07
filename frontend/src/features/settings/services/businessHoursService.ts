import type { WeekDay } from "../types/businessHours"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend/BusinessHours.php"

export const updateBusinessHours = async (
  day: WeekDay,
  startTime: string,
  endTime: string,
  status: string,
): Promise<boolean> => {
  try {
    const token = Cookies.get("token")
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "update",
        day: day,
        status: status,
        start_time: startTime,
        end_time: endTime,
      }),
    })

    const data = await response.json()

    if (data.status === "ok") {
      return true
    } else {
      throw new Error(data.message || "Failed to update business hours")
    }
  } catch (error) {
    console.error("Error updating business hours:", error)
    throw error
  }
}
