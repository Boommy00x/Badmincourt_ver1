// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { format } from "date-fns";
// import { SidebarNav } from "./components/sidebar/SidebarNav";
// import { PendingBookings } from "./components/pending-booking/PendingBookings";
// import BookingTables from "./components/booking-tables/BookingTables";
// import { MetricCard } from "./components/metric-card/MetricCard";
// import { useBookingService } from "@/features/dashboard/hooks/useBookingService";
// import type { Booking } from "@/features/dashboard/types/booking";
// import styles from "./styles/dashboard.module.css";
// import { useBookingData } from "@/features/reports/hooks/useReports";
// import { calculateDailyBookings, calculateDailyRevenue } from "@/features/reports/revenueCalculations";
// import { formatLocalizedDate } from "./utils/date-formatter";
// import BookingDetailsModal from "./components/booking-modal/BookingDetailsModal";

// const DashboardPage = () => { 
//   const { t, i18n } = useTranslation();
//   const [currentDate, setCurrentDate] = useState("");
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [todayRevenue, setTodayRevenue] = useState(0);
//   const [todayBookings, setTodayBookings] = useState(0);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

//   const { bookingData, isLoading: isBookingDataLoading, error: bookingDataError } = useBookingData();
//   const { pendingBookings, confirmedBookings, canceledBookings, updateBookingStatus, isLoading, error } =
//     useBookingService();

//   useEffect(() => {
//     setCurrentDate(formatLocalizedDate(new Date(), t, i18n.language));

//     if (bookingData.length > 0) {
//       const dailyRevenue = calculateDailyRevenue(bookingData);
//       const dailyBookings = calculateDailyBookings(bookingData);
//       const today = format(new Date(), "yyyy-MM-dd");
//       setTodayRevenue(dailyRevenue[today] || 0);
//       setTodayBookings(dailyBookings[today] || 0);
//     }
//   }, [bookingData, t, i18n.language]);

//   // Reset bookings when the component mounts
//   useEffect(() => {
//     // Clear bookings on component mount
//     setSelectedBooking(null);
//   }, []);

//   const handleConfirm = async (id: string, onComplete: () => void): Promise<boolean> => {
//     try {
//       await updateBookingStatus(id, "confirmed");
//       onComplete();
//       return true; // Return true if successful
//     } catch (error) {
//       console.error("Error confirming booking:", error);
//       return false; // Return false if there was an error
//     }
//   };

//   const handleCancel = async (id: string, onComplete: () => void): Promise<boolean> => {
//     try {
//       await updateBookingStatus(id, "cancelled");
//       onComplete();
//       return true; // Return true if successful
//     } catch (error) {
//       console.error("Error cancelling booking:", error);
//       return false; // Return false if there was an error
//     }
//   };

//   const handleBookingClick = (booking: Booking) => {
//     try {
//       // Validate booking object
//       if (!booking?.id || !booking?.fullName) {
//         throw new Error('Invalid booking data');
//       }

//       // Update selected booking state
//       setSelectedBooking(booking);
//       setIsDetailsModalOpen(true);
//     } catch (error) {
//       console.error('Error handling booking click:', error);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsDetailsModalOpen(false);
//     setSelectedBooking(null);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   if (error) {
//     return <div className={styles.error}>{t("error", { message: error })}</div>;
//   }

//   return (
//     <div className={styles.dashboardContainer}>
//       <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
//       <main className={`${styles.mainContent} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
//         {currentDate && <h1 className={styles.dateHeader}>{currentDate}</h1>}

//         <div className={styles.metricCardContainer}>
//           <MetricCard title={t("todayRevenue")} value={`${todayRevenue.toFixed(2)} ฿`} />
//           <MetricCard title={t("todayBookings")} value={todayBookings.toString()} />
//         </div>

//         {isDetailsModalOpen && selectedBooking && (
//           <BookingDetailsModal
//             booking={selectedBooking}
//             onClose={handleCloseModal}
//             onStatusUpdate={updateBookingStatus}
//           />
//         )}

//         <PendingBookings
//           bookings={pendingBookings}
//           onConfirm={handleConfirm}
//           onCancel={handleCancel}
//           isLoading={isLoading}
//         />

//         <div className={styles.tableContainer}>
//           <BookingTables
//             bookings={confirmedBookings}
//             title={t("confirmedBookings")}
//             isLoading={isLoading}
//             onBookingClick={handleBookingClick}
//             date={currentDate}
//             time={new Date().toLocaleTimeString()}
//           />
//           <BookingTables
//             bookings={canceledBookings}
//             title={t("canceledBookings")}
//             isLoading={isLoading}
//             onBookingClick={handleBookingClick}
//             date={currentDate}
//             time={new Date().toLocaleTimeString()}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;


import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { SidebarNav } from "./components/sidebar/SidebarNav";
import { PendingBookings } from "./components/pending-booking/PendingBookings";
import BookingTables from "./components/booking-tables/BookingTables";
import { MetricCard } from "./components/metric-card/MetricCard";
import { useBookingService } from "@/features/dashboard/hooks/useBookingService";
import type { Booking } from "@/features/dashboard/types/booking";
import styles from "./styles/dashboard.module.css";
import { useBookingData } from "@/features/reports/hooks/useReports";
import { calculateDailyBookings, calculateDailyRevenue } from "@/features/reports/revenueCalculations";
import { formatLocalizedDate } from "./utils/date-formatter";
import BookingDetailsModal from "./components/booking-modal/BookingDetailsModal";

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { bookingData, isLoading: isBookingDataLoading, error: bookingDataError } = useBookingData();
  const { pendingBookings, confirmedBookings, canceledBookings, updateBookingStatus, isLoading, error } =
    useBookingService();

  useEffect(() => {
    const updateMetrics = () => {
      setCurrentDate(formatLocalizedDate(new Date(), t, i18n.language));

      if (bookingData.length > 0) {
        const dailyRevenue = calculateDailyRevenue(bookingData);
        const dailyBookings = calculateDailyBookings(bookingData);
        const today = format(new Date(), "yyyy-MM-dd");
        setTodayRevenue(dailyRevenue[today] || 0);
        setTodayBookings(dailyBookings[today] || 0);
      }
    };

    updateMetrics(); // Initial call to set metrics

    // const intervalId = setInterval(updateMetrics, 15000); // Update every 15 seconds

    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, [bookingData, t, i18n.language]);

  const handleConfirm = async (id: string, onComplete: () => void): Promise<boolean> => {
    try {
      await updateBookingStatus(id, "confirmed");
      onComplete();
      return true; // Return true if successful
    } catch (error) {
      console.error("Error confirming booking:", error);
      return false; // Return false if there was an error
    }
  };

  const handleCancel = async (id: string, onComplete: () => void): Promise<boolean> => {
    try {
      await updateBookingStatus(id, "cancelled");
      onComplete();
      return true; // Return true if successful
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false; // Return false if there was an error
    }
  };

  const handleBookingClick = (booking: Booking) => {
    try {
      // Validate booking object
      if (!booking?.id || !booking?.fullName) {
        throw new Error('Invalid booking data');
      }

      // Update selected booking state
      setSelectedBooking(booking);
      setIsDetailsModalOpen(true);

    } catch (error) {
      console.error('Error handling booking click:', error);
    }
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (error) {
    return <div className={styles.error}>{t("error", { message: error })}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
      <main className={`${styles.mainContent} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
        {currentDate && <h1 className={styles.dateHeader}>{currentDate}</h1>}

        <div className={styles.metricCardContainer}>
          <MetricCard title={t("todayRevenue")} value={`${todayRevenue.toFixed(2)} ฿`} />
          <MetricCard title={t("todayBookings")} value={todayBookings.toString()} />
        </div>

        {isDetailsModalOpen && selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={handleCloseModal}
            onStatusUpdate={updateBookingStatus}
          />
        )}

        <PendingBookings
          bookings={pendingBookings}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        <div className={styles.tableContainer}>
          <BookingTables
            bookings={confirmedBookings}
            title={t("confirmedBookings")}
            isLoading={isLoading}
            onBookingClick={handleBookingClick}
          />
          <BookingTables
            bookings={canceledBookings}
            title={t("canceledBookings")}
            isLoading={isLoading}
            onBookingClick={handleBookingClick}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
