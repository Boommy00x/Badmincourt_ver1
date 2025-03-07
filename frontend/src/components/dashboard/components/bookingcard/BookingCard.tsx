import { useEffect, useState } from 'react';
import cn from 'classnames';
import Buttonstyles from '../../styles/Button.module.css';
import styles from './styles/BookingCard.module.css';
import { calculateEndTime } from '@/features/dashboard/types/booking';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { create } from 'lodash';

interface BookingCardProps {
  id: string;
  fullName: string;
  courtNumber: string;
  timeT1: string;
  // timeT2: string;
  slip: string | null;
  status: string;
  isLoading?: boolean;
  isCompact?: boolean;
  onClick?: () => void;
  onConfirm: (id: string, callback: () => void) => void;
  onCancel: (id: string, callback: () => void) => void;
  onDetailClick: (id: string) => void;
  createdAt:string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  id,
  fullName,
  courtNumber,
  timeT1,
  createdAt,
  // timeT2,
  isCompact = false,
  onClick,
  isLoading = false,
  onConfirm,
  onCancel,
  onDetailClick
}) => {
  const { t } = useTranslation(); // Initialize translation
  const [isExiting, setIsExiting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (isLoading) {
    return (
      <div className={`${styles.bookingCard} ${styles.loading}`}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonDetails} />
        <div className={styles.bookingCardButtons}>
          <div className={`${Buttonstyles.confirmButton} ${styles.skeletonButton}`} />
          <div className={`${Buttonstyles.cancelButton} ${styles.skeletonButton}`} />
        </div>
      </div>
    );
  }

  const handleConfirmClick = async () => {
    try {
      setIsActionLoading(true);
      setIsExiting(true);
      await onConfirm(id, () => {
        setIsExiting(false);
        setIsActionLoading(false);
      });
    } catch (error) {
      console.error(t('errorConfirming', { error }), error);
      setIsExiting(false);
      setIsActionLoading(false);
    }
  };

  const handleCancelClick = async () => {
    try {
      setIsActionLoading(true);
      setIsExiting(true);
      await onCancel(id, () => {
        setIsExiting(false);
        setIsActionLoading(false);
      });
    } catch (error) {
      console.error(t('errorCancelling', { error }), error);
      setIsExiting(false);
      setIsActionLoading(false);
    }
  };

  const handleDetailButtonClick = () => {
    onDetailClick(id);
  };
  useEffect(() => {
    const createdAtDate = new Date(createdAt).getTime();
    const now = Date.now();
    const timeElapsed = now - createdAtDate;

    // เก็บเวลาที่ผ่านไปใน localStorage
    localStorage.setItem(`booking_${id}_createdAt`, createdAtDate.toString());
    localStorage.setItem(`booking_${id}_timeElapsed`, timeElapsed.toString());

    // ตรวจสอบเวลาที่ผ่านไป
    if (timeElapsed >= 30000) { // 15 นาที
      handleConfirmClick();
    }

    const timer = setInterval(() => {
      // const storedTimeElapsed = parseInt(localStorage.getItem(`booking_${id}_timeElapsed`) || '0', 10);
      const newElapsed = Date.now() - createdAtDate;

      if (newElapsed >= 30000) { // 15 นาที
        handleConfirmClick();
        clearInterval(timer); // หยุด timer เมื่อทำการยืนยันแล้ว
      } else {
        localStorage.setItem(`booking_${id}_timeElapsed`, newElapsed.toString());
      }
    }, 300000); // ตรวจสอบทุกๆ 5 นาที

    return () => clearInterval(timer);
  }, [createdAt, id]);

  return (
    <div
      className={cn(styles.bookingCard, {
        [styles.exit]: isExiting,
        [styles.compact]: isCompact
      })}
      onClick={onClick}
    >
      <h3 className={styles.bookingCardTitle}>{fullName}</h3>
      <div className={styles.bookingDetails}>
        <p className={styles.bookingCardDetails}>
          {t('payment.details.court')} {courtNumber} {t('payment.details.time')}: {timeT1 || '--:--'} - {calculateEndTime(timeT1)}
        </p>
      </div>
      <div className={Buttonstyles.bookingCardButtons}>
        <button
          onClick={handleConfirmClick}
          className={Buttonstyles.confirmButton}
          disabled={isActionLoading}
        >
          {t('confirm')}
        </button>
        <button
          onClick={handleCancelClick}
          className={Buttonstyles.cancelButton}
          disabled={isActionLoading}
        >
          {t('cancel')}
        </button>
      </div>
      <div className={styles.detailsButtonContainer}>
        <button
          onClick={handleDetailButtonClick}
          className={Buttonstyles.detailsButton}
          disabled={isActionLoading}
        >
          {t('details')}
        </button>
      </div>
    </div>
  );
};

export default BookingCard;


// import React, { useState, useEffect } from 'react';
// import cn from 'classnames';
// import Buttonstyles from '../../styles/Button.module.css';
// import styles from './styles/BookingCard.module.css';
// import { calculateEndTime } from '@/features/dashboard/types/booking';
// import { useTranslation } from 'react-i18next';

// interface BookingCardProps {
//   id: string;
//   fullName: string;
//   courtNumber: string;
//   timeT1: string;
//   timeT2: string;
//   slip: string | null;
//   status: string;
//   isLoading?: boolean;
//   isCompact?: boolean;
//   onClick?: () => void;
//   onConfirm: (id: string, callback: () => void) => void;
//   onCancel: (id: string, callback: () => void) => void;
//   onDetailClick: (id: string) => void;
// }

// const BookingCard: React.FC<BookingCardProps> = ({
//   id,
//   fullName,
//   courtNumber,
//   timeT1,
//   // timeT2,
//   isCompact = false,
//   onClick,
//   // isLoading = false,
//   onConfirm,
//   onCancel,
//   onDetailClick
// }) => {
//   const { t } = useTranslation();
//   const [isExiting, setIsExiting] = useState(false);
//   const [isActionLoading, setIsActionLoading] = useState(false);

//   useEffect(() => {
//     // ตั้งค่า timer เพื่อยืนยันการจองอัตโนมัติหลังจาก 15 นาที (900,000 มิลลิวินาที)
//     const timer = setTimeout(() => {
//       handleConfirmClick();
//     }, 900000);

//     // ล้าง timer หาก component ถูก unmount ก่อนที่ timer จะครบกำหนด
//     return () => clearTimeout(timer);
//   }, []);

//   const handleConfirmClick = async () => {
//     try {
//       setIsActionLoading(true);
//       setIsExiting(true);
//       await onConfirm(id, () => {
//         setIsExiting(false);
//         setIsActionLoading(false);
//       });
//     } catch (error) {
//       console.error(t('errorConfirming', { error }), error);
//       setIsExiting(false);
//       setIsActionLoading(false);
//     }
//   };

//   const handleCancelClick = async () => {
//     try {
//       setIsActionLoading(true);
//       setIsExiting(true);
//       await onCancel(id, () => {
//         setIsExiting(false);
//         setIsActionLoading(false);
//       });
//     } catch (error) {
//       console.error(t('errorCancelling', { error }), error);
//       setIsExiting(false);
//       setIsActionLoading(false);
//     }
//   };

//   const handleDetailButtonClick = () => {
//     onDetailClick(id);
//   };

//   return (
//     <div
//       className={cn(styles.bookingCard, {
//         [styles.exit]: isExiting,
//         [styles.compact]: isCompact
//       })}
//       onClick={onClick}
//     >
//       <h3 className={styles.bookingCardTitle}>{fullName}</h3>
//       <div className={styles.bookingDetails}>
//         <p className={styles.bookingCardDetails}>
//           {t('payment.details.court')} {courtNumber} {t('payment.details.time')}: {timeT1 || '--:--'} - {calculateEndTime(timeT1)}
//         </p>
//       </div>
//       <div className={Buttonstyles.bookingCardButtons}>
//         <button
//           onClick={handleConfirmClick}
//           className={Buttonstyles.confirmButton}
//           disabled={isActionLoading}
//         >
//           {t('confirm')}
//         </button>
//         <button
//           onClick={handleCancelClick}
//           className={Buttonstyles.cancelButton}
//           disabled={isActionLoading}
//         >
//           {t('cancel')}
//         </button>
//       </div>
//       <div className={styles.detailsButtonContainer}>
//         <button
//           onClick={handleDetailButtonClick}
//           className={Buttonstyles.detailsButton}
//           disabled={isActionLoading}
//         >
//           {t('details')}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookingCard;
