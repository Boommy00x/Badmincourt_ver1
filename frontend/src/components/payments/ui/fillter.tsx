import type React from "react"
import { useEffect, useState, useRef } from "react"
// import { Button } from "@/components/ui/button/button"
import { format, addDays } from "date-fns"
import { ChevronDown,Calendar} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdownmenu"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import styles from "./fillter.module.css"
import { useTranslation } from "react-i18next"
const PaymentFilters: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()
  const [selected, setSelected] = useState<Date | undefined>()
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false)
  const datePickerRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()
  
  const handleDateFilter = (filter: "today" | "tomorrow" | "custom", date?: Date) => {
    let newDate
    if (filter === "today") newDate = new Date()
    else if (filter === "tomorrow") newDate = addDays(new Date(), 1)
    else newDate = date

    if (newDate && selectedDate && format(newDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      // If the same date is clicked again, reset the selected date
      setSelectedDate(undefined)
      onFilterChange({ date: undefined, status: selectedStatus })
    } else {
      setSelectedDate(newDate)
      onFilterChange({ date: newDate ? format(newDate, "yyyy-MM-dd") : undefined, status: selectedStatus })
    }
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === selectedStatus ? undefined : status )
    onFilterChange({
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      status: status === selectedStatus ? undefined : status,
    })
  }  
  
  const handleClickOutside = (event: MouseEvent) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
      setDatePickerVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  return (
    <div className={styles.filterWrapper}>
      <h2 className={styles.filterTitle}>{t("filter")} </h2>
      <div className={styles.filterContainer}>
        <button
          onClick={() => handleDateFilter("today")}
          className={`${styles.filterButton} ${selectedDate && format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? styles.active : ""}`}
        >
          {t("today")} 
        </button>
        <button
          onClick={() => handleDateFilter("tomorrow")}
          className={`${styles.filterButton} ${selectedDate && format(selectedDate, "yyyy-MM-dd") === format(addDays(new Date(), 1), "yyyy-MM-dd") ? styles.active : ""}`}
        >
          {t("tomorrow")} 
        </button>
        <button
        onClick={() => setDatePickerVisible(!isDatePickerVisible)}
        className={styles.datePickerButton}
      >
        <Calendar className="mr-2 h-4 w-4" /> {/* Calendar icon */}
        {selected ? format(selected, "yyyy-MM-dd") : t("Select Date")} {/* Display selected date or prompt */}
      </button>
        {isDatePickerVisible && (
          <div ref={datePickerRef} className={styles.datePickerContainer}>
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                setSelected(date);
                handleDateFilter("custom", date);
              }}
              className={styles.datePicker}
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button  className={styles.statusButton}>
             {t("status")} 
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange("completed")}>{t("payment.status.completed")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("failed")}>{t("payment.status.failed")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default PaymentFilters
