export type PaymentStatus = "completed" | "pending" | "failed"

export interface Payment {
  id: string
  slip: string | null
  courtNumber: string
  fullName: string
  status: PaymentStatus
  timeT1: string //เวลาจอง
  timeT2: string //วันจอง
  // timeT3: string //วันจองและเวลา
  createdAt: string
  pricing: string
}

export interface PaymentResponse {
  success: boolean
  payments: Payment[]
  total: number
  error?: string
}

export interface PaymentDetailsModalProps {
  payment: Payment | null
  onClose: () => void
}

