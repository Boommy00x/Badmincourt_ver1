// "use client"

// import type React from "react"
// import { useEffect, useState, useCallback } from "react"
// import styles from "./styles/BookingTables.module.css"
// import { calculateEndTime, type Booking as BookingType } from "@/features/dashboard/types/booking"
// import { useTranslation } from "react-i18next"
// import { safeFormatDate } from "@/utils/dateUtils"

// interface BookingTablesProps {
//   bookings: BookingType[]
//   title: string
//   isLoading?: boolean
//   onBookingClick?: (booking: BookingType) => void
//   className?: string
// }

// const BookingTables: React.FC<BookingTablesProps> = ({
//   bookings,
//   title,
//   isLoading = false,
//   onBookingClick,
//   className,
// }) => {
//   const { t } = useTranslation()
//   const [sortedBookings, setSortedBookings] = useState<BookingType[]>([])
//   const [currentDate, setCurrentDate] = useState<string>("")

//   const filterBookingsByDate = useCallback(() => {
//     try {
//       const now = new Date()
//       const tomorrow = new Date(now)
//       tomorrow.setDate(tomorrow.getDate() + 1)

//       const targetDate = now.getHours() >= 0 ? now : tomorrow
//       const dateStr = targetDate.toISOString().split("T")[0]

//       const filteredBookings = bookings.filter((booking) => {
//         if (!booking.created_at) return false
//         const bookingDate = safeFormatDate(booking.created_at)
//         return bookingDate === dateStr
//       })

//       const sorted = [...filteredBookings].sort((a, b) => {
//         try {
//           const timeA = new Date(`${a.timeT2}T${a.timeT1}`).getTime()
//           const timeB = new Date(`${b.timeT2}T${b.timeT1}`).getTime()
//           return timeB - timeA
//         } catch (error) {
//           console.error("Error sorting bookings:", error)
//           return 0
//         }
//       })

//       setCurrentDate(dateStr)
//       setSortedBookings(sorted)
//     } catch (error) {
//       console.error("Error filtering bookings:", error)
//       setSortedBookings([])
//     }
//   }, [bookings])

//   useEffect(() => {
//     filterBookingsByDate()
    
//     const now = new Date()
//     const tomorrow = new Date(now)
//     tomorrow.setDate(tomorrow.getDate() + 1)
//     tomorrow.setHours(0, 0, 0, 0)

//     const msUntilMidnight = tomorrow.getTime() - now.getTime()

//     const timerId = setTimeout(() => {
//       filterBookingsByDate()
//       setInterval(filterBookingsByDate, 24 * 60 * 60 * 10000)
//     }, msUntilMidnight)

//     return () => {
//       clearTimeout(timerId)
//     }
//   }, [filterBookingsByDate])

//   const getStatusClassName = (status: string): string => {
//     const normalizedStatus = status.toLowerCase().trim()
//     switch (normalizedStatus) {
//       case "confirmed":
//         return styles.statusConfirmed
//       case "cancelled":
//         return styles.statusCancelled
//       case "pending":
//         return styles.statusDefault
//       default:
//         return styles.statusDefault
//     }
//   }

//   const formatStatus = (status: string): string => {
//     switch (status.toLowerCase()) {
//       case "confirmed":
//         return t("Booking.details.status.confirmed")
//       case "cancelled":
//         return t("Booking.details.status.cancelled")
//       case "pending":
//         return t("Booking.details.status.pending")
//       default:
//         return status
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.loadingCard}>
//           <div className={styles.spinner} />
//           <p className={styles.loadingText}>{t("loadingBookings")}</p>
//           <div className={styles.tableContainer}>
//             {[1, 2, 3].map((index) => (
//               <div key={index} className={styles.skeletonRow} />
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`${styles.bookingTablesContainer} ${className || ""}`}>
//       <section className={styles.section}>
//         <h2 className={styles.sectionTitle}>
//           {title}
//         </h2>
//         <div className={styles.tableWrapper}>
//           <div className={styles.tableContainer}>
//             {sortedBookings.length === 0 ? (
//               <p className={styles.noBookings}>{t("noBookingsAvailable")}</p>
//             ) : (
//               <table className={styles.bookingTable}>
//                 <thead>
//                   <tr className={styles.tableRow}>
//                     <th className={styles.tableHead}>{t("name")}</th>
//                     <th className={styles.tableHead}>{t("court")}</th>
//                     <th className={styles.tableHead}>{t("time")}</th>
//                     <th className={styles.tableHead}>{t("date")}</th>
//                     <th className={styles.tableHead}>{t("status")}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedBookings.map((booking) => {
//                     const endTime = calculateEndTime(booking.timeT1)
//                     return (
//                       <tr
//                         key={booking.id}
//                         className={styles.tableRow}
//                         onClick={() => onBookingClick?.(booking)}
//                         role="button"
//                         tabIndex={0}
//                       >
//                         <td className={styles.tableCell}>{booking.fullName}</td>
//                         <td className={styles.tableCell}>{booking.courtNumber}</td>
//                         <td className={styles.tableCell}>{`${booking.timeT1}-${endTime}`}</td>
//                         <td className={styles.tableCell}>{booking.timeT2}</td>
//                         <td className={styles.tableCell}>
//                           <span className={getStatusClassName(booking.status)}>{formatStatus(booking.status)}</span>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default BookingTables

"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import styles from "./styles/BookingTables.module.css"
import { calculateEndTime, type Booking as BookingType } from "@/features/dashboard/types/booking"
import { useTranslation } from "react-i18next"
import { DateTime } from 'luxon';
// import { safeFormatDate } from "@/utils/dateUtils"

interface BookingTablesProps {
  bookings: BookingType[]
  title: string
  isLoading?: boolean
  onBookingClick?: (booking: BookingType) => void
  className?: string
}

const BookingTables: React.FC<BookingTablesProps> = ({
  bookings,
  title,
  isLoading = false,
  onBookingClick,
  className,
}) => {
  const { t } = useTranslation()
  const [sortedBookings, setSortedBookings] = useState<BookingType[]>([])
  const [currentDate, setCurrentDate] = useState<string>("")

  const dt = DateTime.now().setZone('Asia/Bangkok');
  
  // console.log(dt.toString());  // Displays the date and time in Bangkok time zone
  const filterBookingsByDate = useCallback(() => {
    try {
      // const now = new Date();
      //เวลาสำหรับการรีเซ้ตตามวัน
      const targetDate = dt.toFormat('yyyy-MM-dd');

      const filteredBookings = bookings.filter((booking) => {
        // console.log(dt.toLocaleString(DateTime.DATETIME_MED))
        //  console.log(targetDate)
        //  console.log(booking.timeT2 == targetDate)
        if (!booking.timeT2) return false;
      
        return booking.timeT2 == targetDate;
      });

      const sorted = [...filteredBookings].sort((a, b) => {
        try {
          const timeA = new Date(`${a.timeT2}T${a.timeT1}`).getTime();
          const timeB = new Date(`${b.timeT2}T${b.timeT1}`).getTime();
          return timeB - timeA;
        } catch (error) {
          console.error("Error sorting bookings:", error);
          return 0;
        }
      });

      setCurrentDate(targetDate);
      setSortedBookings(sorted);
      // console.log(`Filtered bookings for ${targetDate} at ${new Date().toLocaleTimeString()}:`, sorted);
    } catch (error) {
      console.error("Error filtering bookings:", error);
      setSortedBookings([]);
    }
  }, [bookings]);

  useEffect(() => {
    filterBookingsByDate() // เรียกใช้ฟังก์ชันตอนโหลดครั้งแรก

    // // ตั้งเวลารีเซ็ตข้อมูลทุก 1 นาที
    // const intervalId = setInterval(() => {
    //   filterBookingsByDate()
    //   console.log("Refreshing bookings data...")
    // }, 60000) // 60000 milliseconds = 1 minute

    // return () => {
    //   clearInterval(intervalId)
    // }
  }, [filterBookingsByDate])

  const getStatusClassName = (status: string): string => {
    const normalizedStatus = status.toLowerCase().trim()
    switch (normalizedStatus) {
      case "confirmed":
        return styles.statusConfirmed
      case "cancelled":
        return styles.statusCancelled
      case "pending":
        return styles.statusDefault
      default:
        return styles.statusDefault
    }
  }

  const formatStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return t("Booking.details.status.confirmed")
      case "cancelled":
        return t("Booking.details.status.cancelled")
      case "pending":
        return t("Booking.details.status.pending")
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>{t("loadingBookings")}</p>
          <div className={styles.tableContainer}>
            {[1, 2, 3].map((index) => (
              <div key={index} className={styles.skeletonRow} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.bookingTablesContainer} ${className || ""}`}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {title}
        </h2>
        <div className={styles.tableWrapper}>
          <div className={styles.tableContainer}>
            {sortedBookings.length === 0 ? (
              <p className={styles.noBookings}>{t("noBookingsAvailable")}</p>
            ) : (
              <table className={styles.bookingTable}>
                <thead>
                  <tr className={styles.tableRow}>
                    <th className={styles.tableHead}>{t("name")}</th>
                    <th className={styles.tableHead}>{t("court")}</th>
                    <th className={styles.tableHead}>{t("time")}</th>
                    <th className={styles.tableHead}>{t("date")}</th>
                    <th className={styles.tableHead}>{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings.map((booking) => {
                    const endTime = calculateEndTime(booking.timeT1)
                    return (
                      <tr
                        key={booking.id}
                        className={styles.tableRow}
                        onClick={() => onBookingClick?.(booking)}
                        role="button"
                        tabIndex={0}
                      >
                        <td className={styles.tableCell}>{booking.fullName}</td>
                        <td className={styles.tableCell}>{booking.courtNumber}</td>
                        <td className={styles.tableCell}>{`${booking.timeT1}-${endTime}`}</td>
                        <td className={styles.tableCell}>{booking.timeT2}</td>
                        <td className={styles.tableCell}>
                          <span className={getStatusClassName(booking.status)}>{formatStatus(booking.status)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookingTables

