export interface Court {
  id: string
  name: string
  image: string
  status: "Active" | "Inactive"
  pricing: string
  schedule: Record<string, DaySchedule>;
  status_time: Array<Record<string, { status: string; start_time: string; end_time: string }>>; // This is correct
}

export interface CourtUpdateData {
  status?: "Active" | "Inactive"
  isOpen?: boolean
  day: string
  closures?: Closure
  type: "status" | "status_all" | "closures_add" | "closures_remove"
}

export interface CourtResponse {
  success: boolean
  data: Court
  message?: string
}

export interface Closure {
  lock_start: string
  lock_end: string
}

export interface DaySchedule {
  open: string
  close: string
  isOpen: boolean
  closures: Closure[]
  // start_time : string
  // end_time : string
}

