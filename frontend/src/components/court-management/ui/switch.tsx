import React from 'react';
import styles from './switch.module.css';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean; // เพิ่ม prop disabled
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`${styles.switch} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`} // เพิ่ม class สำหรับ disabled
      onClick={() => {
        if (!disabled) { // ตรวจสอบว่าไม่ disabled ก่อนเรียก onCheckedChange
          onCheckedChange(!checked);
        }
      }}
      disabled={disabled} // เพิ่ม disabled ที่นี่
    >
      <span className={styles.thumb} />
    </button>
  );
};