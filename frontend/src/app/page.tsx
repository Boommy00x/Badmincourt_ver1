// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// // import { Loader2 } from "lucide-react"
// import { useAuth } from "../features/auth/hooks/useAuth"
// import { useNotification } from "../components/context/NotificationContext"
// import BadmintonLoader from "@/components/loader/badmintonLoader"

// export default function Home() {
//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const { notify } = useNotification() // Get the notify function from context

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.push("/dashboard")
//         notify("Welcome back!", "success") // Show success notification
//       } else {
//         router.push("/auth")
//         notify("Please log in", "info") // Show info notification
//       }
//     }
//   }, [user, loading, router, notify])

//   return (
//     <main className="flex items-center justify-center min-h-screen">
//        <BadmintonLoader />
//     </main>
//   )
// }

"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck"; // นำเข้า Custom Hook
import BadmintonLoader from "@/components/loader/badmintonLoader";

export default function Home() {
  const isCheckingAuth = useAuthCheck(); // เรียกใช้ Hook และรับสถานะการตรวจสอบ

  // แสดง Loader ขณะที่กำลังตรวจสอบคุกกี้
  if (isCheckingAuth) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <BadmintonLoader />
      </main>
    );
  }

  // หากตรวจสอบเสร็จสิ้นและไม่มี token ผู้ใช้จะถูก Redirect ไปยังหน้า /auth
  // หากมี token ผู้ใช้จะถูก Redirect ไปยังหน้า /dashboard
  return null; // ไม่ต้องแสดงอะไรเพิ่มเติม
}