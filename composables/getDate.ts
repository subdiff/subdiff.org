import { DateTime } from "luxon"

export const getDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)
}