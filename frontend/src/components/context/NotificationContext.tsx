"use client"

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import { notify } from "../ui/toaster" // Import the notify function from Toaster

// Define notification types
type NotificationType = "info" | "success" | "warning" | "error"

// Create context for notifications
interface NotificationContextType {
  notify: (message: string, type: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notifyWrapper = (message: string, type: NotificationType) => {
    notify(message, type); // Call the notify function from Toaster
  }

  return (
    <NotificationContext.Provider value={{ notify: notifyWrapper }}>
      {children}
    </NotificationContext.Provider>
  )
}
