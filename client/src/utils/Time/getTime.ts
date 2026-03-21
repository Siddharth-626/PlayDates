/**
 * Converts a Firestore Timestamp or Date to a display time string with AM/PM.
 */
export const getTime = (date: any): string => {
    if (!date) return "";
    const target = date.toDate ? date.toDate() : new Date(date);
    return target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};
