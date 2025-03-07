import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button/button"
// import { Calendar } from "@/components/ui/calendar/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/popover"
import styles from "./date-picker.module.css"

interface DatePickerProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholderText: string
}

export function DatePicker({ selected, onSelect, placeholderText }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(styles.datePickerButton, !selected && styles.placeholder)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "MMMM do, yyyy") : placeholderText}
        </Button>
      </PopoverTrigger>
      {/* <PopoverContent className={styles.popoverContent} align="start">
        <Calendar mode="single" selected={selected} onSelect={onSelect} initialFocus />
      </PopoverContent> */}
    </Popover>
  )
}

