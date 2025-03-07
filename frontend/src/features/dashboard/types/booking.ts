export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string
  slip: string | null
  courtNumber: string
  fullName: string
  timeT1: string // เวลาจอง
  timeT2: string // วันจอง
  pricing: string
  createdAt: string
  status: BookingStatus
  // created_at:string
}

// ฟังก์ชันเพื่อคำนวณเวลาสิ้นสุด
export const calculateEndTime = (startTime: string | null): string => {
  if (!startTime) return '--:--';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes + 60);
  return date.toTimeString().slice(0, 5);
};

export interface BookingResponse {
  success: boolean;
  data: Booking[];
  message?: string;
}

// ยังไม่ได้ใช้งาน
export interface BookingFilters {
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  courtId?: number;
}

// ยังไม่ได้ใช้งาน
export interface DailyMetrics {
  revenue: number;
  count: number;
}