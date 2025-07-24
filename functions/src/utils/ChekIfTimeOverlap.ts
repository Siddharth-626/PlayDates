import { Timestamp } from "firebase-admin/firestore";
import { AvailabilityType } from "./Type";

export const isTimeOverlap = (availabilityA: any, availabilityB: any): boolean => {
    const parseDurationToMinutes = (durationStr: string): number => {
        const lowerStr = durationStr.toLowerCase();

        if (lowerStr.includes("hour")) {
            // Handles both "1 hour" and "1.5 hour"
            const hours = parseFloat(lowerStr.split(" ")[0]);
            return Math.round(hours * 60);
        } else if (lowerStr.includes("min")) {
            const minutes = parseInt(lowerStr.split(" ")[0]);
            return minutes;
        } else {
            return 0;
        }
    };

    const parseDateTime = (availability: AvailabilityType): [number, number] => {
        const dateObj: Date = availability.date instanceof Timestamp
            ? availability.date.toDate()
            : availability.date;

        const [hours, minutes] = availability.time.split(":").map(Number);
        const durationMinutes = parseDurationToMinutes(availability.duration);

        const startTime = new Date(dateObj);
        startTime.setHours(hours, minutes, 0, 0);

        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        return [startTime.getTime(), endTime.getTime()];
    };

    const [startA, endA] = parseDateTime(availabilityA);
    const [startB, endB] = parseDateTime(availabilityB);

    return startA < endB && startB < endA;
};
