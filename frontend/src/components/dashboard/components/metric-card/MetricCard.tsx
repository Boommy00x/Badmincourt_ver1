import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import styles from './styles/MetricCard.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function MetricCard({ title, value, className }: MetricCardProps) {
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // ฟังก์ชันที่คุณต้องการให้ทำงานทุก ๆ 1 นาที
  //     console.log("Refreshing metric data...");
  //     // คุณสามารถเรียกใช้ฟังก์ชันที่รีเฟรชข้อมูลที่นี่
  //   }, 30000); // 60000 milliseconds = 1 minute

  //   return () => {
  //     clearInterval(intervalId); // ทำความสะอาด interval เมื่อคอมโพเนนต์ถูกทำลาย
  //   };
  // }, []); // ใช้ [] เพื่อให้ useEffect ทำงานเพียงครั้งเดียวเมื่อคอมโพเนนต์ถูกสร้าง

  return (
    <div className={cn(
      styles.metricCard,
      className
    )}>
      <h3 className={styles.metricTitle}>{title}</h3>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}
