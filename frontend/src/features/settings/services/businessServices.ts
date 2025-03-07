import type { BusinessHours, BusinessHoursResponse, WeekDay, DaySchedule } from "../types/businessHours"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend/BusinessHours.php"

export const BusinessHoursService = {
  async fetch(): Promise<BusinessHours> {
    try {
      const token = Cookies.get("token")
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, type: "fetch" }),
      })
      const data: BusinessHoursResponse = await response.json()

      if (data.status === "ok") {
        const businessHours: BusinessHours = data.data.reduce((acc, day) => {
          const [weekDay, schedule] = Object.entries(day)[0] as [WeekDay, DaySchedule]
          acc[weekDay] = schedule
          return acc
        }, {} as BusinessHours)

        return businessHours
      } else {
        throw new Error("Failed to fetch business hours")
      }
    } catch (error) {
      console.error("Error fetching business hours:", error)
      throw error
    }
  },
}
