import { useState, useCallback } from "react"
import type { WeekDay } from "../types/businessHours"
import { updateBusinessHours } from "../services/businessHoursService"

export function useBusinessHoursUpdate() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateHours = useCallback(async (day: WeekDay, startTime: string, endTime: string, status: string) => {
    setIsUpdating(true)
    setError(null)
    try {
      const success = await updateBusinessHours(day, startTime, endTime, status)
      if (!success) {
        throw new Error("Failed to update business hours")
      }
      return true
    } catch (err) {
      setError("Error updating business hours")
      console.error("Error updating business hours:", err)
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [])

  return {
    updateHours,
    isUpdating,
    error,
  }
}

