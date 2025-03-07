import axios from "axios"
import type { Court, CourtUpdateData, CourtResponse } from "../types/court"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend"

export const updateCourtService = {
  async updateCourt(id: string, data: CourtUpdateData): Promise<CourtResponse> {
    try {
      const token = Cookies.get("token") || "ojfdjifeijrfgijrtoidfiojfejifgeijge"
      // console.log("Sending update request:", { id, ...data })
      const response = await axios.post(
        `${API_URL}/updateCourt.php`,
        {
          token: token,
          id: id,
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      )

      // console.log("Received response:", response.data)

      if (response.data && response.data.status === "ok") {
        return {
          success: true,
          data: response.data.data,
          message: "Court updated successfully",
        }
      } else {
        const errorMessage = response.data.message || "Failed to update court"
        console.error("Update failed:", errorMessage)
        return {
          success: false,
          data: {} as Court,
          message: errorMessage,
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message)
        if (error.code === "ECONNABORTED") {
          return {
            success: false,
            data: {} as Court,
            message: "Request timed out. Please try again.",
          }
        }
        return {
          success: false,
          data: {} as Court,
          message: `Network error: ${error.message}`,
        }
      } else {
        console.error("Unknown error:", error)
        return {
          success: false,
          data: {} as Court,
          message: "An unknown error occurred",
        }
      }
    }
  },
}

