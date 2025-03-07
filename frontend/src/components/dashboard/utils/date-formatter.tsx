import { format } from "date-fns"

export const formatLocalizedDate = (date: Date, t: any, language: string) => {
  const day = format(date, "EEEE").toLowerCase()
  const month = format(date, "MMMM").toLowerCase()
  const dateNum = format(date, "d")
  const year = language === "th" ? (date.getFullYear() + 543).toString() : date.getFullYear().toString()

  // Access the nested translations under reports.Date
  return `${t(`reports.Date.days.${day}`)}${t("reports.Date.separator")} ${dateNum} ${t(`reports.Date.months.${month}`)} ${year}`
}

