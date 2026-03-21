/**
 * Parses a time string into 24-hour {hours, minutes}.
 * Supports formats: "2:30 PM", "14:30", "2:30PM"
 */
export const parseTimeString = (time: string): { hours: number; minutes: number } | null => {
    if (!time || typeof time !== "string") return null;

    // Try AM/PM format first: "2:30 PM", "2:30PM"
    const ampmMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = parseInt(ampmMatch[2], 10);
        const period = ampmMatch[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return { hours, minutes };
    }

    // Try 24-hour format: "14:30"
    const match24 = time.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        return {
            hours: parseInt(match24[1], 10),
            minutes: parseInt(match24[2], 10),
        };
    }

    return null;
};
