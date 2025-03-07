import { useState, useCallback } from "react"
import type { CourtUpdateData } from "../types/court"
import { updateCourtService } from "../services/courtUpdateServices"

export function useUpdateCourt() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const updateCourt = useCallback(async (id: string, data: CourtUpdateData) => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      const response = await updateCourtService.updateCourt(id, data)
      if (response.success) {
        return response
      }
      setUpdateError(response.message || "Unknown error occurred")
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update court"
      console.error("Error in useUpdateCourt:", errorMessage)
      setUpdateError(errorMessage)
      return { success: false, data: {}, message: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  return {
    updateCourt,
    isUpdating,
    updateError,
  }
}

export { updateCourtService }

