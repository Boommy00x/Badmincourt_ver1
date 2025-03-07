"use client"

import React from "react"
import { ThemeProvider } from "@/components/context/ThemeContext"
import { AuthProvider } from "@/components/context/AuthContext"
import { UserProvider } from "@/components/context/UserContext"
import { NotificationProvider } from "@/components/context/NotificationContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            {children}
            <ToastContainer />
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}