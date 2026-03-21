/**
 * Checks if a match has ended.
 * Supports endTime as Firestore Timestamp or string ("2:30 PM", "14:30").
 */
export const hasMatchEnded = (date: any, endTime: any) => {
    if (!endTime || !date) return false;
    const now = new Date();

    // If endTime is a Firestore Timestamp, compare directly
    if (endTime?.toDate) {
        return endTime.toDate().getTime() < now.getTime();
    }

    // If endTime is a string, parse it
    if (typeof endTime !== "string") return false;

    const isPM = /pm/i.test(endTime);
    const isAM = /am/i.test(endTime);
    const formattedEndTime = endTime.replace(/\s?(am|pm)\s?/i, "").trim();
    let [hours, minutes] = formattedEndTime.split(":").map(Number);

    if (isPM && hours !== 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const target = date.toDate ? date.toDate() : new Date(date);
    target.setHours(hours, minutes, 0, 0);

    return target.getTime() < now.getTime();
};
