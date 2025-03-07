import { useState, useCallback } from "react"
import type { BusinessHours } from "../types/businessHours"
import { BusinessHoursService } from "../services/businessServices"

export function useBusinessHours() {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBusinessHours = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await BusinessHoursService.fetch()
      setBusinessHours(data)
      setError(null)
    } catch (err) {
      setError("Error fetching business hours")
      console.error("Error fetching business hours:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    businessHours,
    isLoading,
    error,
    fetchBusinessHours,
  }
}

