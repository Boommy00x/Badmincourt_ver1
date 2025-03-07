import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './styles/bookingpoliciesmodal.module.css';

interface BookingPoliciesCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingPoliciesCard: React.FC<BookingPoliciesCardProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.cardPopup}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h3>Booking Policies</h3>
              <button 
                onClick={onClose}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div className={styles.policySettings}>
              <div className={styles.policyItem}>
                <label>
                  <Pencil size={16} className={styles.icon} />
                  Advance Booking Period
                </label>
                <div className={styles.inputGroup}>
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    defaultValue="7"
                    className={styles.numberInput}
                  />
                  <span>days</span>
                </div>
              </div>

              <div className={styles.policyItem}>
                <label>
                  <Pencil size={16} className={styles.icon} />
                  Cancellation Notice Required
                </label>
                <div className={styles.inputGroup}>
                  <input 
                    type="number"
                    min="1"
                    max="48"
                    defaultValue="24"
                    className={styles.numberInput}
                  />
                  <span>hours</span>
                </div>
              </div>

              <div className={styles.policyItem}>
                <label>
                  <Pencil size={16} className={styles.icon} />
                  Booking Duration Limits
                </label>
                <div className={styles.durationInputs}>
                  <div className={styles.inputGroup}>
                    <input 
                      type="number"
                      min="1"
                      max="4"
                      defaultValue="1"
                      className={styles.numberInput}
                    />
                    <span>hours min</span>
                  </div>
                  <span>to</span>
                  <div className={styles.inputGroup}>
                    <input 
                      type="number"
                      min="1"
                      max="8"
                      defaultValue="2"
                      className={styles.numberInput}
                    />
                    <span>hours max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button 
                className={styles.saveButton}
                onClick={() => {
                  // Save logic here
                  onClose();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
