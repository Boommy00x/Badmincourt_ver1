export const safeFormatDate = (dateString: string): string => {
    try {
      if (dateString && dateString.includes(" ")) {
        const [datePart] = dateString.split(" ")
        return datePart
      }
      return new Date().toISOString().split("T")[0]
    } catch (error) {
      console.error("Error formatting date:", error)
      return new Date().toISOString().split("T")[0]
    }
  }
  
  