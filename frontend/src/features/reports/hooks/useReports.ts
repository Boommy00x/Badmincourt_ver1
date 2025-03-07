// import { useState, useEffect } from "react"
// import { fetchBookingData } from "../services/reportServices"
// import type { BookingData } from "../types/reports"

// export const useBookingData = () => {
//   const [bookingData, setBookingData] = useState<BookingData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const loadBookingData = async () => {
//       try {
//         setIsLoading(true)
//         const data = await fetchBookingData()
//         setBookingData(data)
//         setError(null)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unknown error occurred")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadBookingData()
//   }, [])

//   return { bookingData, isLoading, error }
// }

import { useState, useEffect } from "react"
import { fetchBookingData } from "../services/reportServices"
import type { BookingData } from "../types/reports"

export const useBookingData = () => {
  const [bookingData, setBookingData] = useState<BookingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBookingData()
        setBookingData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadBookingData()
  }, [])

  return { bookingData, isLoading, error }
}
