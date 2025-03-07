// // "use client";

// // import { useState, useEffect, useCallback, useRef } from "react";
// // import type { Booking, BookingStatus } from "../types/booking";
// // import bookingService from "../services/bookingService";
// // import { useNotification } from "@/components/context/NotificationContext";

// // const RESET_INTERVAL = 5000; // 24 ชั่วโมง
// // const RESET_KEY = "lastResetTime";
// // const TEMP_BOOKINGS_KEY = "tempBookings";
// // const CONFIRMED_BOOKINGS_KEY = "confirmedBookings";
// // const CANCELLED_BOOKINGS_KEY = "cancelledBookings";

// // export const useBookingService = () => {
// //   const [bookings, setBookings] = useState<Booking[]>([]);
// //   const [tempBookings, setTempBookings] = useState<Booking[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const previousBookingsRef = useRef<Booking[]>([]);
// //   const { notify } = useNotification();

// //    // ฟังก์ชันสำหรับดึงข้อมูลการจองที่ถูกรีเซ็ตตามเวลา
// //   const fetchAllBookings = useCallback(async () => {
// //     try {
// //       setIsLoading(true);
// //       const lastResetTime = localStorage.getItem(RESET_KEY);
// //       const now = Date.now();

// //       // ตรวจสอบว่าต้องใช้ข้อมูลที่เก็บไว้หรือไม่
// //       if (lastResetTime && now - Number.parseInt(lastResetTime) < RESET_INTERVAL) {
// //         const storedTempBookings = localStorage.getItem(TEMP_BOOKINGS_KEY);
// //         if (storedTempBookings) {
// //           setTempBookings(JSON.parse(storedTempBookings)); // ใช้ข้อมูลที่เก็บไว้
// //           setIsLoading(false);
// //           return;
// //         }
// //       }

// //       if (Array.isArray(response.data)) {
// //         const newBookings = response.data.map((booking: any) => ({
// //           id: booking.id,
// //           slip: booking.slip,
// //           courtNumber: booking.court_number,
// //           fullName: booking.full_name,
// //           timeT1: booking.time_t1,
// //           timeT2: booking.time_t2,
// //           pricing: booking.price,
// //           status:
// //             booking.status_confirm === "0"
// //               ? "pending"
// //               : booking.status_confirm === "1"
// //               ? "confirmed"
// //               : ("cancelled" as BookingStatus),
// //         }));

// //         // ตรวจสอบการจองใหม่ที่รอดำเนินการ
// //         const newPendingBookings = newBookings.filter(
// //           (newBooking) =>
// //             newBooking.status === "pending" &&
// //             !previousBookingsRef.current.some((oldBooking) => oldBooking.id === newBooking.id),
// //         );

// //         if (newPendingBookings.length > 0) {
// //           notify(`มีการจองใหม่ ${newPendingBookings.length} รายการ`, "info");
// //         }

// //         setBookings(newBookings);
// //         setTempBookings(newBookings);
// //         localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify(newBookings)); // เก็บข้อมูลใน localStorage
// //         previousBookingsRef.current = newBookings; // อัปเดตการจองก่อนหน้า
// //       } else {
// //         console.warn("No bookings found or invalid data format:", response.data);
// //         setBookings([]);
// //         setTempBookings([]);
// //         localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify([])); // เก็บข้อมูลว่างใน localStorage
// //       }
// //     } catch (err) {
// //       setError("Failed to fetch bookings");
// //       console.error("Error fetching bookings:", err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [notify]);
  
// //     // ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด (ไม่ถูกรีเซ็ต)
// //     const fetchBookings  = useCallback(async () => {
// //       try {
// //         setIsLoading(true)
// //         const lastResetTime = localStorage.getItem(RESET_KEY)
// //         const now = Date.now()
  
// //         // Check if we need to use cached data or fetch new data
// //         if (lastResetTime && now - Number.parseInt(lastResetTime) < RESET_INTERVAL) {
// //           const storedTempBookings = localStorage.getItem(TEMP_BOOKINGS_KEY)
// //           if (storedTempBookings) {
// //             setTempBookings(JSON.parse(storedTempBookings))
// //             setIsLoading(false)
// //             return
// //           }
// //         }
  
// //         // Fetch new data from the API
// //         const today = new Date().toISOString().split("T")[0]
// //         const response = await bookingService.getBookingsByDate(today)
  
// //         if (Array.isArray(response.data)) {
// //           const newBookings = response.data.map((booking: any) => ({
// //             id: booking.id,
// //             slip: booking.slip,
// //             courtNumber: booking.court_number,
// //             fullName: booking.full_name,
// //             timeT1: booking.time_t1,
// //             timeT2: booking.time_t2,
// //             pricing: booking.price,
// //             status:
// //               booking.status_confirm === "0"
// //                 ? "cancelled"
// //                 : booking.status_confirm === "1"
// //                   ? "confirmed"
// //                   : ("pending" as BookingStatus),
// //           }))
  
// //           // Check for new pending bookings
// //           const newPendingBookings = newBookings.filter(
// //             (newBooking) =>
// //               newBooking.status === "pending" &&
// //               !previousBookingsRef.current.some((oldBooking) => oldBooking.id === newBooking.id),
// //           )
  
// //           if (newPendingBookings.length > 0) {
// //             notify(`มีการจองใหม่ ${newPendingBookings.length} รายการ`, "info")
// //           }
  
// //           setBookings(newBookings)
// //           setTempBookings(newBookings)
// //           localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify(newBookings))
// //           previousBookingsRef.current = newBookings
// //         } else {
// //           console.warn("No bookings found or invalid data format:", response.data)
// //           setBookings([])
// //           setTempBookings([])
// //           localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify([]))
// //         }
// //       } catch (err) {
// //         setError("Failed to fetch bookings")
// //         console.error("Error fetching bookings:", err)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }, [notify])

// //   // ฟังก์ชันสำหรับอัปเดตสถานะการจอง
// //   const updateBookingStatus = async (id: string, status: BookingStatus) => {
// //     try {
// //       console.log(`Updating booking status for ID: ${id} to ${status}`);
// //       const response = await bookingService.updateBookingStatus(id, status);

// //       if (response.success) {
// //         const updateBookings = (prevBookings: Booking[]) =>
// //           prevBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking));

// //         setBookings(updateBookings);
// //         setTempBookings(updateBookings);
// //         localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify(updateBookings(tempBookings))); // อัปเดตข้อมูลใน localStorage

// //         console.log(`Booking status updated successfully for ID: ${id}`);
// //         return true;
// //       }
// //       return false;
// //     } catch (err) {
// //       console.error("Error updating booking:", err);
// //       return false;
// //     }
// //   };

// //     // ฟังก์ชันสำหรับรีเซ็ตการจองและดึงข้อมูลใหม่
// //   const resetAndFetchBookings = useCallback(() => {
// //     setTempBookings([]);
// //     localStorage.setItem(TEMP_BOOKINGS_KEY, JSON.stringify([])); // ลบข้อมูลใน localStorage
// //     localStorage.setItem(RESET_KEY, Date.now().toString()); // อัปเดตเวลาที่รีเซ็ต
// //     console.log("Temporary bookings reset triggered");
// //     fetchBookings(); // ดึงข้อมูลใหม่ทันทีหลังจากที่มีการรีเซ็ต
// //   }, [fetchBookings]);

// //   // Effect สำหรับการดึงข้อมูลเริ่มต้นและรีเซ็ตตามระยะเวลา
// //   useEffect(() => {
// //     fetchBookings(); // ดึงข้อมูลเริ่มต้น

// //     const checkAndResetInterval = setInterval(() => {
// //       const lastResetTime = localStorage.getItem(RESET_KEY);
// //       const now = Date.now();
// //       if (!lastResetTime || now - Number.parseInt(lastResetTime) >= RESET_INTERVAL) {
// //         resetAndFetchBookings(); // รีเซ็ตและดึงข้อมูลใหม่
// //       }
// //     }, 6000); // ตรวจสอบทุกนาที

// //     return () => clearInterval(checkAndResetInterval); // เคลียร์ interval เมื่อคอมโพเนนต์ถูกทำลาย
// //   }, [fetchBookings, resetAndFetchBookings]);

// //   // กรองการจองตามสถานะ
// //   const pendingBookings = tempBookings.filter((booking) => booking.status === "pending");
// //   const confirmedBookings = tempBookings.filter((booking) => booking.status === "confirmed");
// //   const canceledBookings = tempBookings.filter((booking) => booking.status === "cancelled");

// //   return {
// //     pendingBookings,
// //     confirmedBookings,
// //     canceledBookings,
// //     isLoading,
// //     error,
// //     updateBookingStatus,
// //     refreshBookings: fetchBookings,
// //     resetBookings: resetAndFetchBookings,
// //     fetchAllBookings, // เพิ่มฟังก์ชันนี้เพื่อให้สามารถเรียกใช้ได้จากภายนอก
// //   };
// // }; 
// // "use client"

// // import { useState, useEffect, useCallback, useRef } from "react"
// // import type { Booking, BookingStatus } from "../types/booking"
// // import bookingService from "../services/bookingService"
// // import { useNotification } from "@/components/context/NotificationContext"

// // export const useBookingService = () => {
// //   const [bookings, setBookings] = useState<Booking[]>([]) // สถานะสำหรับการจองทั้งหมด
// //   const [displayBookings, setDisplayBookings] = useState<Booking[]>([]) // สถานะสำหรับการจองที่จะแสดง
// //   const [isLoading, setIsLoading] = useState(true) // สถานะการโหลดข้อมูล
// //   const [error, setError] = useState<string | null>(null) // สถานะข้อผิดพลาด
// //   const { notify } = useNotification() // ฟังก์ชันสำหรับการแจ้งเตือน
// //   const previousBookingsRef = useRef<Booking[]>([]); // ใช้เก็บข้อมูลการจองก่อนหน้า

// //   // ฟังก์ชันสำหรับตรวจสอบว่าการจองควรแสดงในวันปัจจุบันหรือวันถัดไป
// //   const shouldDisplayBooking = useCallback((createdAt: string) => {
// //     const now = new Date()
// //     const bookingDate = new Date(createdAt)
// //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
// //     const tomorrow = new Date(today)
// //     tomorrow.setDate(tomorrow.getDate() + 1)

// //     // ถ้าเวลาปัจจุบันเป็นหลังเที่ยงคืน ให้แสดงข้อมูลของวันถัดไป
// //     if (now.getHours() >= 0 && now.getHours() < 24) {
// //       return bookingDate >= today && bookingDate < tomorrow
// //     }
// //     // ถ้าเวลาปัจจุบันเป็นก่อนเที่ยงคืน ให้แสดงข้อมูลของวันปัจจุบัน
// //     return bookingDate >= today && bookingDate < tomorrow
// //   }, [])

// //   // ฟังก์ชันสำหรับกรองข้อมูลการจองตามวันที่
// //   const filterBookingsByDate = useCallback(
// //     (allBookings: Booking[]) => {
// //       return allBookings.filter((booking) => {
// //         // ตรวจสอบว่ามี created_at หรือไม่
// //         if (!booking.created_at) return false
// //         return shouldDisplayBooking(booking.created_at)
// //       })
// //     },
// //     [shouldDisplayBooking],
// //   )

// //   // ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด
// //   const fetchAllBookings = useCallback(async () => {
// //     try {
// //       setIsLoading(true)
// //       const response = await bookingService.getAllBookings()

// //       if (Array.isArray(response.data)) {
// //         const newBookings = response.data.map((booking: any) => ({
// //           id: booking.id,
// //           slip: booking.slip,
// //           courtNumber: booking.court_number,
// //           fullName: booking.full_name,
// //           timeT1: booking.time_t1,
// //           timeT2: booking.time_t2,
// //           pricing: booking.price,
// //           created_at: booking.created_at, // เพิ่ม created_at
// //           status:
// //             booking.status_confirm === "2"
// //               ? "cancelled"
// //               : booking.status_confirm === "1"
// //                 ? "confirmed"
// //                 : ("pending" as BookingStatus),
// //         }))

// //         setBookings(newBookings)
// //         // กรองข้อมูลที่จะแสดงตามวันที่
// //         const filteredBookings = filterBookingsByDate(newBookings)
// //         setDisplayBookings(filteredBookings)
// //       }
// //     } catch (err) {
// //       setError("Failed to fetch bookings")
// //       console.error("Error fetching bookings:", err)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }, [filterBookingsByDate])


// //   // ฟังก์ชันสำหรับอัปเดตสถานะการจอง
// //   const updateBookingStatus = async (id: string, status: BookingStatus) => {
// //     try {
// //       const response = await bookingService.updateBookingStatus(id, status)
// //       if (response.success) {
// //         const updatedBookings = bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking))
// //         setBookings(updatedBookings)
// //         // อัปเดตข้อมูลที่แสดงด้วย
// //         const filteredBookings = filterBookingsByDate(updatedBookings)
// //         setDisplayBookings(filteredBookings)
// //         return true
// //       }
// //       return false
// //     } catch (err) {
// //       console.error("Error updating booking:", err)
// //       return false
// //     }
// //   }
  
// //   //ฟังก์ชันสำหรับการดึงข้อมูลการจองcard
// //   const fetchBookingCardData = useCallback(async () => {
// //     try {
// //       setIsLoading(true);
// //       const response = await bookingService.getAllBookings(); // Fetch all bookings
  
// //       if (Array.isArray(response.data)) {
// //         const bookingCardData: Booking[] = response.data.map((booking: any) => ({
// //           id: booking.id,
// //           slip: booking.slip,
// //           courtNumber: booking.court_number,
// //           fullName: booking.full_name,
// //           timeT1: booking.time_t1,
// //           timeT2: booking.time_t2,
// //           pricing: booking.price,
// //           created_at: booking.created_at,
// //           status:
// //             booking.status_confirm === "0"
// //               ? "pending"
// //               : booking.status_confirm === "1"
// //                 ? "confirmed"
// //                 : ("cancelled" as BookingStatus),
// //         }));
// //         // ตรวจสอบการเปลี่ยนแปลงสถานะจาก "pending" เป็น "confirmed" หรือ "cancelled"
// //         const newPendingBookings = bookingCardData.filter(
// //             (newBooking) =>
// //             newBooking.status === "pending" &&
// //             !previousBookingsRef.current.some((oldBooking) => oldBooking.id === newBooking.id),
// //         )

// //       if (newPendingBookings.length > 0) {
// //         notify(`มีการจองใหม่ ${newPendingBookings.length} รายการ`, "info")
// //       }

// //         setDisplayBookings(bookingCardData);
// //       } else {
// //         console.warn("No bookings found or invalid data format:", response.data);
// //         setDisplayBookings([]);
// //       }
// //     } catch (err) {
// //       setError("Failed to fetch booking card data");
// //       console.error("Error fetching booking card data:", err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [notify]);

// //   // Effect สำหรับการดึงข้อมูลและรีเซ็ตตามเวลา
// //   useEffect(() => {
// //     fetchAllBookings(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลการจอง

// //     // ตั้งเวลารีเซ็ตที่เที่ยงคืน
// //     const now = new Date();
// //     const midnight = new Date(now);
// //     midnight.setHours(24, 0, 0, 0)
// //     const timeUntilMidnight = midnight.getTime() - now.getTime()

// //     // ตั้ง timeout สำหรับการรีเซ็ตครั้งแรก
// //     const timeoutId = setTimeout(() => {
// //       fetchAllBookings(); // ดึงข้อมูลการจองใหม่ที่เที่ยงคืน
// //       // หลังจากรีเซ็ตครั้งแรก ตั้ง interval ทุก 24 ชั่วโมง
// //       setInterval(fetchAllBookings, 24 * 60 * 60 * 1000);
// //     }, timeUntilMidnight);

// //     return () => {
// //       clearTimeout(timeoutId); // เคลียร์ timeout เมื่อคอมโพเนนต์ถูกทำลาย
// //     };
// //   }, [fetchAllBookings]);

// //   useEffect(() => {
// //     const intervalId = setInterval(() => {
// //       fetchBookingCardData()
// //     }, 30000) // รีหน้าทุกๆ30 วินาที

// //     fetchBookingCardData() // 

// //     return () => clearInterval(intervalId) 
// //   }, [fetchBookingCardData])

// //   // กรองข้อมูลตามสถานะ
// //   const pendingBookings = displayBookings.filter((booking) => booking.status === "pending");
// //   const confirmedBookings = displayBookings.filter((booking) => booking.status === "confirmed");
// //   const canceledBookings = displayBookings.filter((booking) => booking.status === "cancelled");

// //   return {
// //     pendingBookings,
// //     confirmedBookings,
// //     canceledBookings,
// //     isLoading,
// //     error,
// //     updateBookingStatus,
// //     refreshBookings: fetchAllBookings, // ฟังก์ชันสำหรับรีเฟรชข้อมูลการจอง
// //     fetchBookingCardData, // ฟังก์ชันสำหรับดึงข้อมูลการจองที่ใช้ใน booking card
// //   }; 
// // }
// "use client"

// import { useState, useEffect, useCallback } from "react"
// import type { Booking, BookingStatus } from "../types/booking"
// import bookingService from "../services/bookingService"
// import { useNotification } from "@/components/context/NotificationContext"

// export const useBookingService = () => {
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [displayBookings, setDisplayBookings] = useState<Booking[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const { notify } = useNotification()

//   // ฟังก์ชันสำหรับตรวจสอบว่าการจองควรแสดงในวันปัจจุบันหรือวันถัดไป
//   const shouldDisplayBooking = useCallback((createdAt: string) => {
//     const now = new Date()
//     const bookingDate = new Date(createdAt)
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
//     const tomorrow = new Date(today)
//     tomorrow.setDate(tomorrow.getDate() + 1)

//     // ถ้าเวลาปัจจุบันเป็นหลังเที่ยงคืน ให้แสดงข้อมูลของวันถัดไป
//     if (now.getHours() >= 0 && now.getHours() < 24) {
//       return bookingDate >= today && bookingDate < tomorrow
//     }
//     // ถ้าเวลาปัจจุบันเป็นก่อนเที่ยงคืน ให้แสดงข้อมูลของวันปัจจุบัน
//     return bookingDate >= today && bookingDate < tomorrow
//   }, [])

//   // ฟังก์ชันสำหรับกรองข้อมูลการจองตามวันที่
//   const filterBookingsByDate = useCallback(
//     (allBookings: Booking[]) => {
//       return allBookings.filter((booking) => {
//         // ตรวจสอบว่ามี created_at หรือไม่
//         if (!booking.created_at) return false
//         return shouldDisplayBooking(booking.created_at)
//       })
//     },
//     [shouldDisplayBooking],
//   )

//   // ฟังก์ชันสำหรับดึงข้อมูลการจอง
//   const fetchBookings = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const response = await bookingService.getAllBookings()

//       if (Array.isArray(response.data)) {
//         const newBookings = response.data.map((booking: any) => ({
//           id: booking.id,
//           slip: booking.slip,
//           courtNumber: booking.court_number,
//           fullName: booking.full_name,
//           timeT1: booking.time_t1,
//           timeT2: booking.time_t2,
//           pricing: booking.price,
//           created_at: booking.created_at, // เพิ่ม created_at
//           status:
//             booking.status_confirm === "2"
//               ? "cancelled"
//               : booking.status_confirm === "1"
//                 ? "confirmed"
//                 : ("pending" as BookingStatus),
//         }))

//         setBookings(newBookings)
//         // กรองข้อมูลที่จะแสดงตามวันที่
//         const filteredBookings = filterBookingsByDate(newBookings)
//         setDisplayBookings(filteredBookings)
//       }
//     } catch (err) {
//       setError("Failed to fetch bookings")
//       console.error("Error fetching bookings:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [filterBookingsByDate])

//   // ฟังก์ชันสำหรับอัปเดตสถานะการจอง
//   const updateBookingStatus = async (id: string, status: BookingStatus) => {
//     try {
//       const response = await bookingService.updateBookingStatus(id, status)
//       if (response.success) {
//         const updatedBookings = bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking))
//         setBookings(updatedBookings)
//         // อัปเดตข้อมูลที่แสดงด้วย
//         const filteredBookings = filterBookingsByDate(updatedBookings)
//         setDisplayBookings(filteredBookings)
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("Error updating booking:", err)
//       return false
//     }
//   }

//   // Effect สำหรับการดึงข้อมูลและรีเซ็ตตามเวลา
//   useEffect(() => {
//     fetchBookings()

//     // ตั้งเวลารีเซ็ตที่เที่ยงคืน
//     const now = new Date()
//     const midnight = new Date(now)
//     midnight.setHours(24, 0, 0, 0)
//     const timeUntilMidnight = midnight.getTime() - now.getTime()

//     // ตั้ง timeout สำหรับการรีเซ็ตครั้งแรก
//     const timeoutId = setTimeout(() => {
//       fetchBookings()
//       // หลังจากรีเซ็ตครั้งแรก ตั้ง interval ทุก 24 ชั่วโมง
//       setInterval(fetchBookings, 24 * 60 * 60 * 1000)
//     }, timeUntilMidnight)

//     // ตั้ง interval สำหรับการอัปเดตข้อมูลทุก 30 วินาที
//     const intervalId = setInterval(fetchBookings, 30000)

//     return () => {
//       clearTimeout(timeoutId)
//       clearInterval(intervalId)
//     }
//   }, [fetchBookings])

//   // กรองข้อมูลตามสถานะ
//   const pendingBookings = displayBookings.filter((booking) => booking.status === "pending")
//   const confirmedBookings = displayBookings.filter((booking) => booking.status === "confirmed")
//   const canceledBookings = displayBookings.filter((booking) => booking.status === "cancelled")

//   return {
//     pendingBookings,
//     confirmedBookings,
//     canceledBookings,
//     isLoading,
//     error,
//     updateBookingStatus,
//     refreshBookings: fetchBookings,
//   }
// }
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Booking, BookingStatus } from "../types/booking"
import bookingService from "../services/bookingService"
import { useNotification } from "@/components/context/NotificationContext"

export const useBookingService = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousBookingsRef = useRef<Booking[]>([])
  const { notify } = useNotification()

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await bookingService.getAllBookings()

      if (Array.isArray(response.data)) {
        const newBookings = response.data.map((booking: any) => ({
          id: booking.id,
          slip: booking.slip,
          courtNumber: booking.court_number,
          fullName: booking.full_name,
          timeT1: booking.time_t1,
          timeT2: booking.time_t2,
          pricing: booking.price,

          createdAt: booking.created_at,
          status:
            booking.status_confirm === "0"
              ? "pending"
              : booking.status_confirm === "1"
                ? "confirmed"
                : ("cancelled" as BookingStatus),
        }))

        // ตรวจสอบการเปลี่ยนแปลงสถานะจาก "pending" เป็น "confirmed" หรือ "cancelled"
        const newPendingBookings = newBookings.filter(
          (newBooking) =>
            newBooking.status === "pending" &&
            !previousBookingsRef.current.some((oldBooking) => oldBooking.id === newBooking.id),
        )

        if (newPendingBookings.length > 0) {
          notify(`มีการจองใหม่ ${newPendingBookings.length} รายการ`, "info")
        }

        setBookings(newBookings)
        previousBookingsRef.current = newBookings
      } else {
        console.warn("No bookings found or invalid data format:", response.data)
        setBookings([])
      }
    } catch (err) {
      setError("Failed to fetch bookings")
      console.error("Error fetching bookings:", err)
    } finally {
      setIsLoading(false)
    }
  }, [notify])
  
  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      // console.log(`Updating booking status for ID: ${id} to ${status}`)
      const response = await bookingService.updateBookingStatus(id, status)
      if (response.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
        )
        // console.log(`Booking status updated successfully for ID: ${id}`)
        return true
      }
      return false
    } catch (err) {
      console.error("Error updating booking:", err)
      return false
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchBookings()
    }, 63000) // รีfetchทุกๆ1นาที

    fetchBookings() // 

    return () => clearInterval(intervalId) 
  }, [fetchBookings])

  const pendingBookings = bookings.filter((booking) => booking.status === "pending")
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed")
  const canceledBookings = bookings.filter((booking) => booking.status === "cancelled")

  return {
    pendingBookings,
    confirmedBookings,
    canceledBookings,
    isLoading,
    error,
    updateBookingStatus,
    refreshBookings: fetchBookings,
  }
}

