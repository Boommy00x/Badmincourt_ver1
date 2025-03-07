import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useNotification } from "../components/context/NotificationContext";

export function useAuthCheck() {
  const router = useRouter();
  const { notify } = useNotification();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // สถานะการตรวจสอบคุกกี้

  useEffect(() => {
    const token = Cookies.get("token"); // ตรวจสอบคุกกี้ token

    if (token) {
      // หากมี token ให้ Redirect ไปยังหน้า /dashboard
      router.push("/dashboard");
      notify("Welcome back!", "success"); // แจ้งเตือนสำเร็จ
    } else {
      // หากไม่มี token ให้ Redirect ไปยังหน้า /auth
      router.push("/auth");
      notify("Please log in", "info"); // แจ้งเตือนให้เข้าสู่ระบบ
    }

    setIsCheckingAuth(false); // หยุดการตรวจสอบ
  }, [router, notify]);

  return isCheckingAuth; // ส่งกลับสถานะการตรวจสอบ
}