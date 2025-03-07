"use client"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useEffect, useCallback } from "react"

// Load the local audio file
// const audio = new Audio("/notification_sound.mp3")

export const Toaster = () => {
  // const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // audioRef.current = audio
      // audioRef.current.preload = "auto"

      // Allow user to click on the page to unlock audio playback
      // const handleUserInteraction = () => {
      //   if (audioRef.current) {
      //     audioRef.current.muted = false
      //   }
      //   document.removeEventListener("click", handleUserInteraction)
      // }

      // document.addEventListener("click", handleUserInteraction, { once: true })

      // return () => {
      //   document.removeEventListener("click", handleUserInteraction)
      // }
    }
  }, [])

  const playAudio = useCallback(() => {
    // if (audioRef.current) {
    //   audioRef.current.currentTime = 0 // Reset audio to start
    //   audioRef.current.play().catch((error) => {
    //     console.error("Audio playback failed:", error)
    //   })
    // }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ 
          maxWidth: '90%', // Limit width on smaller screens
          margin: '0 auto', // Center the toast container
        }}
      />
    </>
  )
}

// Function to show notifications
export const notify = (message: string, type: "info" | "success" | "warning" | "error") => {
  const toastOptions = {
    onOpen: () => {
      // Uncomment the following lines to enable audio playback
      // if (audio) {
      //   audio.currentTime = 0 // Reset to start
      //   audio.play().catch((error) => {
      //     console.error("Error playing notification sound:", error)
      //   })
      // }
    },
    onClose: () => {
      // Uncomment the following lines to reset audio when closing
      // audio.pause()
      // audio.currentTime = 0 // Reset audio when closing
    },
  }

  switch (type) {
    case "info":
      toast.info(message, toastOptions)
      break
    case "success":
      toast.success(message, toastOptions)
      break
    case "warning":
      toast.warn(message, toastOptions)
      break
    case "error":
      toast.error(message, toastOptions)
      break
    default:
      toast(message, toastOptions)
      break
  }
}
