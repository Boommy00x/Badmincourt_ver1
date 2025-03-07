import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuthRedirect(redirectPath: string = "/auth") {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token"); // ตรวจสอบคุกกี้ token
    if (!token) {
      router.push(redirectPath); // Redirect ไปยัง path ที่กำหนดหากไม่มี token
    }
  }, [router, redirectPath]);
}