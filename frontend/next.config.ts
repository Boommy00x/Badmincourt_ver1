import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  trailingSlash: true, // เพิ่ม / ต่อท้าย URL
  images: {
    remotePatterns: [
      {
        protocol: "http", // หรือ "https" ถ้าเซิร์ฟเวอร์รองรับ SSL
        hostname: "badmincourt.pro",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ให้ ESLint ข้ามข้อผิดพลาดระหว่างการ build
  },
};

export default nextConfig;