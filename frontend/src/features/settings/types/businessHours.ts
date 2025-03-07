export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export type DaySchedule = {
  status: "Active" | "Inactive"
  start_time: string
  end_time: string
}

export type BusinessHours = {
  [key in WeekDay]: DaySchedule
}

export interface BusinessHoursResponse {
  status: string
  data: Array<{ [key in WeekDay]: DaySchedule }>
}

