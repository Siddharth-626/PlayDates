/**
 * Returns human-readable time left until match starts.
 * Supports startTime as Firestore Timestamp or string ("2:30 PM", "14:30").
 * When startTime is a string, matchDate is used as the base date.
 */
export const getTimeLeft = (startTime: any, matchDate?: any) => {
    if (!startTime) return null;

    const now = new Date();
    let target: Date;

    // If startTime is a Firestore Timestamp, use directly
    if (startTime?.toDate) {
        target = startTime.toDate();
    } else if (typeof startTime === "string") {
        const isPM = /pm/i.test(startTime);
        const isAM = /am/i.test(startTime);
        const formattedStartTime = startTime.replace(/\s?(am|pm)\s?/i, "").trim();
        let [hours, minutes] = formattedStartTime.split(":").map(Number);

        if (isPM && hours !== 12) hours += 12;
        if (isAM && hours === 12) hours = 0;

        // Use match date if available, otherwise fall back to today
        const base = matchDate?.toDate?.() ?? (matchDate ? new Date(matchDate) : new Date());
        target = new Date(base);
        target.setHours(hours, minutes, 0, 0);

        // Only use tomorrow fallback if no match date was provided
        if (!matchDate && target.getTime() < now.getTime()) {
            target.setDate(target.getDate() + 1);
        }
    } else {
        return null;
    }

    const diffMs = target.getTime() - now.getTime();
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0) {
        return "Started";
    } else if (hoursLeft > 0) {
        return `${hoursLeft}h ${minutesLeft}m`;
    } else {
        return `${minutesLeft}m ${secondsLeft}s`;
    }
};
