import { useState } from 'react';
import BookingCard from '../bookingcard/BookingCard';
import BookingDetailsModal from '../booking-modal/BookingDetailsModal';
import styles from './styles/PendingBookings.module.css';
import { Booking } from '@/features/dashboard/types/booking';
import { useTranslation } from 'react-i18next';

interface PendingBookingsProps {
  bookings: Booking[];
  onConfirm: (id: string, callback: () => void) => void;
  onCancel: (id: string, callback: () => void) => void;
  isLoading?: boolean;
}

export function PendingBookings({
  bookings,
  onConfirm,
  onCancel,
  isLoading = false,
}: PendingBookingsProps) {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <section className={styles.pendingBookingsSection}>
      <h2 className={styles.sectionTitle}>{t('pendingBookingRequests')}</h2>
      <div className={styles.bookingGrid}>
        {isLoading ? (
          <div>{t('loading')}</div>
        ) : bookings.length === 0 ? (
          <div>{t('noPendingBookings')}</div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
            key={booking.id}
            {...booking}
            onConfirm={onConfirm}
            onCancel={onCancel}
            onDetailClick={(id) => {
              setSelectedBooking(booking);
              setIsModalOpen(true);
            }}
          />
          ))
        )}
      </div>

      {isModalOpen && selectedBooking && (
      <BookingDetailsModal
      booking={selectedBooking}
      onClose={handleCloseModal}
      onStatusUpdate={async (id, status) => {
        if (status === 'confirmed') {
          await onConfirm(id, handleCloseModal);
        } else {
          await onCancel(id, handleCloseModal);
        }
        return true;
      }}
    />
  )}
    </section>
  );

}