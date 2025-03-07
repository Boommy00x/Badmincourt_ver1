import type { BookingData } from "./types/reports"

const PRICE_PER_COURT = 150

// ถ้า bookings ไม่เป็น Array ให้คืนค่า object ว่าง
function checkBookings(bookings: any): BookingData[] {
  return Array.isArray(bookings) ? bookings : []
}

export const calculateDailyRevenue = (bookings: BookingData[] = []): { [key: string]: number } => {
  // ตรวจสอบว่า bookings เป็น Array หรือไม่
  bookings = checkBookings(bookings)
  const dailyRevenue: { [key: string]: number } = {}

  bookings.forEach((booking) => {
    if (booking.status === "อนุมัติ") {
      const date = booking.time_t2
      dailyRevenue[date] = (dailyRevenue[date] || 0) + PRICE_PER_COURT
    }
  })

  return dailyRevenue
}

export const calculateWeeklyRevenue = (bookings: BookingData[] = []): { [key: string]: number } => {
  bookings = checkBookings(bookings)
  const weeklyRevenue: { [key: string]: number } = {}

  bookings.forEach((booking) => {
    if (booking.status === "อนุมัติ") {
      const date = new Date(booking.time_t2)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split("T")[0]

      weeklyRevenue[weekKey] = (weeklyRevenue[weekKey] || 0) + PRICE_PER_COURT
    }
  })

  return weeklyRevenue
}

export const calculateMonthlyRevenue = (bookings: BookingData[] = []): { [key: string]: number } => {
  bookings = checkBookings(bookings)
  const monthlyRevenue: { [key: string]: number } = {}

  bookings.forEach((booking) => {
    if (booking.status === "อนุมัติ") {
      const date = new Date(booking.time_t2)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + PRICE_PER_COURT
    }
  })

  return monthlyRevenue
}

export const calculateYearlyRevenue = (bookings: BookingData[] = []): { [key: string]: number } => {
  bookings = checkBookings(bookings)
  const yearlyRevenue: { [key: string]: number } = {}

  bookings.forEach((booking) => {
    if (booking.status === "อนุมัติ") {
      const year = new Date(booking.time_t2).getFullYear().toString()

      yearlyRevenue[year] = (yearlyRevenue[year] || 0) + PRICE_PER_COURT
    }
  })

  return yearlyRevenue
}

export function calculateDailyBookings(bookings: BookingData[]): Record<string, number> {
  const dailyRevenue = calculateDailyRevenue(bookings)
  const dailyBookings: Record<string, number> = {}

  for (const [date, revenue] of Object.entries(dailyRevenue)) {
    dailyBookings[date] = revenue / PRICE_PER_COURT
  }

  return dailyBookings
}

export function calculateWeeklyBookings(bookings: BookingData[]): Record<string, number> {
  const weeklyRevenue = calculateWeeklyRevenue(bookings)
  const weeklyBookings: Record<string, number> = {}

  for (const [week, revenue] of Object.entries(weeklyRevenue)) {
    weeklyBookings[week] = revenue / PRICE_PER_COURT
  }

  return weeklyBookings
}

export function calculateMonthlyBookings(bookings: BookingData[]): Record<string, number> {
  const monthlyRevenue = calculateMonthlyRevenue(bookings)
  const monthlyBookings: Record<string, number> = {}

  for (const [month, revenue] of Object.entries(monthlyRevenue)) {
    monthlyBookings[month] = revenue / PRICE_PER_COURT
  }

  return monthlyBookings
}

export function calculateYearlyBookings(bookings: BookingData[]): Record<string, number> {
  const yearlyRevenue = calculateYearlyRevenue(bookings)
  const yearlyBookings: Record<string, number> = {}

  for (const [year, revenue] of Object.entries(yearlyRevenue)) {
    yearlyBookings[year] = revenue / PRICE_PER_COURT
  }

  return yearlyBookings
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
