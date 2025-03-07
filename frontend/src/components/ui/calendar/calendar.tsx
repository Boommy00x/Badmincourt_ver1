// "use client"

// import type * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { DayPicker } from "react-day-picker"
// import { cn } from "@/lib/utils"
// import styles from "./calendar.module.css"

// export function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: React.ComponentProps<typeof DayPicker>) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn(styles.root, className)}
//       classNames={{
//         months: styles.months,
//         month: styles.month,
//         caption: styles.caption,
//         caption_label: styles.captionLabel,
//         nav: styles.nav,
//         nav_button: cn(styles.navButton),
//         nav_button_previous: styles.navButtonPrevious,
//         nav_button_next: styles.navButtonNext,
//         table: styles.table,
//         head_row: styles.headRow,
//         head_cell: styles.headCell,
//         row: styles.row,
//         cell: styles.cell,
//         day: cn(styles.day),
//         day_selected: styles.daySelected,
//         day_today: styles.dayToday,
//         day_outside: styles.dayOutside,
//         day_disabled: styles.dayDisabled,
//         day_range_start: styles.dayRangeStart,
//         day_range_end: styles.dayRangeEnd,
//         day_range_middle: styles.dayRangeMiddle,
//         ...classNames,
//       }}
//       components={{
//         IconLeft: ({ ...props }) => <ChevronLeft className={styles.navIcon} {...props} />,
//         IconRight: ({ ...props }) => <ChevronRight className={styles.navIcon} {...props} />,
//       }}
//       {...props}
//     />
//   )
// }

