export interface BookingData {
  slip: string;
  court_number: string;
  full_name: string;
  status: string;
  time_t1: string;
  time_t2: string;
  time_t3: string;
  created_at: string;
}

export interface DailyReport {
  date: string;
  revenue: number;
  bookings: number;
  cancellations: number;
}

export interface MonthlyData {
  name: string;
  value: number;
}

export interface YearlyData {
  year: string;
  value: number;
}

export type RevenueAndBookingsStats = {
  revenue: { [key: string]: number }
  bookings: { [key: string]: number }
  cancellations: { [key: string]: number }
}

