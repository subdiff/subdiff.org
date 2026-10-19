import { DateTime } from "luxon"

export const getDate = (date: string | Date | undefined | null) => {
    if (!date) {
        return ""
    }
    if (date instanceof Date) {
        return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL)
    }

    // Support ISO 8601 strings, SQL datetime strings ("YYYY-MM-DD HH:mm:ss"), and fallback formats
    let dt = DateTime.fromISO(date)
    if (!dt.isValid) {
        dt = DateTime.fromSQL(date)
    }
    if (!dt.isValid) {
        dt = DateTime.fromISO(date.replace(" ", "T"))
    }

    return dt.isValid ? dt.toLocaleString(DateTime.DATE_FULL) : ""
}