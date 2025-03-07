'use client';

import type React from "react";
import { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Court, Closure } from "@/features/court-management/types/court";
import { useUpdateCourt } from "@/features/court-management/hooks/useUpdateCourt";
import { ClosureDialog } from "./ClosureDialog";
import { Button } from "../ui/button/button";
import { Switch } from "../ui/switch/switch";
import { Badge } from "../ui/badge/badge";
import styles from "./styles/courteditmodal.module.css";

interface CourtEditModalProps {
  court: Court | null;
  onClose: () => void;
  onUpdate: (court: Court) => void;
}

export const CourtEditModal: React.FC<CourtEditModalProps> = ({ court, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const { updateCourt } = useUpdateCourt();
  const [status, setStatus] = useState(court?.status || "Inactive");
  const [schedule, setSchedule] = useState(court?.schedule || {});
  const [isClosureDialogOpen, setIsClosureDialogOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [statusTime, setStatusTime] = useState<Record<string, { status: string; start_time: string; end_time: string }> >({});

  useEffect(() => {
    if (court) {
      setStatus(court.status);
      setSchedule(court.schedule);

      const statusTimeMap: Record<string, { status: string; start_time: string; end_time: string }> = {};
      court.status_time.forEach((entry) => {
        const day = Object.keys(entry)[0];
        statusTimeMap[day] = entry[day];
      });
      setStatusTime(statusTimeMap);
    }
  }, [court]);

  const updateCourtData = useCallback(
    (updatedCourt: Court) => {
      onUpdate(updatedCourt);
      setStatus(updatedCourt.status);
      setSchedule(updatedCourt.schedule);
    },
    [onUpdate],
  );

  const toggleMainStatus = async () => {
    if (!court) return;

    const newStatus = status === "Active" ? "Inactive" : "Active";
    // console.log(`Toggling main status to: ${newStatus}`);

    try {
      const result = await updateCourt(court.id, {
        isOpen: newStatus === "Active",
        type: "status_all",
        day: "",
      });

      if (result.success) {
        const updatedSchedule = Object.fromEntries(
          Object.entries(schedule).map(([day, daySchedule]) => [
            day,
            { ...daySchedule, isOpen: newStatus === "Active" },
          ]),
        );

        updateCourtData({
          ...court,
          status: newStatus,
          schedule: updatedSchedule,
        });

        // console.log(`Main status updated successfully to: ${newStatus}`);
      } else {
        console.error(result.message || t("unknownError"));
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : t("unknownError"));
    }
  };

  const toggleDayOpen = async (day: string) => {
    if (!court) return;
    if (status === "Inactive") return;

    const newIsOpen = !schedule[day].isOpen;
    // console.log(`Toggling ${day} status to: ${newIsOpen ? "Open" : "Closed"}`);

    try {
      const result = await updateCourt(court.id, {
        day,
        isOpen: newIsOpen,
        type: "status",
      });

      if (result.success) {
        const updatedSchedule = {
          ...schedule,
          [day]: { ...schedule[day], isOpen: newIsOpen },
        };

        const anyDayOpen = Object.values(updatedSchedule).some((day) => day.isOpen);

        updateCourtData({
          ...court,
          status: anyDayOpen ? "Active" : "Inactive",
          schedule: updatedSchedule,
        });

        // console.log(`${day} status updated successfully to: ${newIsOpen ? "Open" : "Closed"}`);
      } else {
        console.error(result.message || t("unknownError"));
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : t("unknownError"));
    }
  };

  const handleAddClosure = async (closure: Closure) => {
    if (!currentDay || !court) return;

    // console.log(`Adding closure for ${currentDay}: ${closure.lock_start} - ${closure.lock_end}`);

    try {
      const result = await updateCourt(court.id, {
        day: currentDay,
        closures: closure,
        type: "closures_add",
      });

      if (result.success) {
        const updatedSchedule = {
          ...schedule,
          [currentDay]: {
            ...schedule[currentDay],
            closures: [...schedule[currentDay].closures, closure],
          },
        };

        updateCourtData({
          ...court,
          schedule: updatedSchedule,
        });

        // console.log(`Closure added successfully for ${currentDay}`);
      } else {
        console.error(result.message || t("unknownError"));
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : t("unknownError"));
    }

    setIsClosureDialogOpen(false);
  };

  const handleRemoveClosure = async (day: string, index: number) => {
    if (!court) return;

    const closureToRemove = schedule[day].closures[index];
    // console.log(`Removing closure for ${day}: ${closureToRemove.lock_start} - ${closureToRemove.lock_end}`);

    try {
      const result = await updateCourt(court.id, {
        day: day,
        closures: closureToRemove,
        type: "closures_remove",
      });

      if (result.success) {
        const updatedSchedule = {
          ...schedule,
          [day]: {
            ...schedule[day],
            closures: schedule[day].closures.filter((_, i) => i !== index),
          },
        };

        updateCourtData({
          ...court,
          schedule: updatedSchedule,
        });

        // console.log(`Closure removed successfully for ${day}`);
      } else {
        console.error(result.message || t("unknownError"));
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : t("unknownError"));
    }
  };

  const formatTimeTo24Hour = (time: string) => {
    const [hour, minute] = time.split(":");
    const hourIn24 = parseInt(hour, 10);
    
    if (time === "00:00" || time === "12:00 AM") {
      return "23:00"; // ปรับเป็น 11:00
    }
    
    return time.replace(/(AM|PM)/, "").trim(); // ลบ AM/PM
  };

  const getFormattedEndTime = (endTime: string) => {
    const formattedTime = formatTimeTo24Hour(endTime);
    return formattedTime || "--:--";
  };

  if (!court) return null;

  return (
    <AnimatePresence>
      {court && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>

            <h2 className={styles.title}>{t("editCourtTitle", { courtName: court.name })}</h2>

            <div className={styles.form}>
              <div className={styles.statusGroup}>
                <span>{t("status")}</span>
                <Switch checked={status === "Active"} onCheckedChange={toggleMainStatus} />
              </div>

              <div className={styles.scheduleGroup}>
                {Object.entries(schedule).map(([day, daySchedule]) => (
                  <div key={day} className={styles.daySchedule}>
                    <div className={styles.dayHeader}>
                      <span className={styles.dayName}>{t(day.toLowerCase())}</span>
                      <Switch checked={daySchedule.isOpen} onCheckedChange={() => toggleDayOpen(day)} />
                    </div>
                    {daySchedule.isOpen && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className={styles.timeRange}>
                            <Clock className="inline-block mr-1" size={16} />
                            {statusTime[day]?.start_time || "--:--"} - {getFormattedEndTime(statusTime[day]?.end_time || "--:--")}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentDay(day);
                              setIsClosureDialogOpen(true);
                            }}
                          >
                            {t("addClosure")}
                          </Button>
                        </div>
                        <div className={styles.closureList}>
                          {daySchedule.closures.map((closure, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {closure.lock_start} - {closure.lock_end}
                              <X
                                className={styles.closeDailog}
                                size={14}
                                onClick={() => handleRemoveClosure(day, index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ClosureDialog
              isOpen={isClosureDialogOpen}
              onClose={() => {
                setIsClosureDialogOpen(false);
                setCurrentDay(null);
              }}
              onAdd={handleAddClosure}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
