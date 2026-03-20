import { Timestamp } from "firebase-admin/firestore";
import { AvailabilityType } from "./Type";


const parseDateTime = (availability: AvailabilityType): [number, number] => {
    const startDate =
        availability.startDate instanceof Timestamp
            ? availability.startDate.toDate()
            : availability.startDate;

    const endDate =
        availability.endDate instanceof Timestamp
            ? availability.endDate.toDate()
            : availability.endDate;

    return [startDate.getTime(), endDate.getTime()];
};



export const isTimeOverlap = (availabilityA: any, availabilityB: any): boolean => {


    const [startA, endA] = parseDateTime(availabilityA);
    const [startB, endB] = parseDateTime(availabilityB);

    return startA < endB && startB < endA;
};

export const getCommonTime = (availabilityA: any, availabilityB: any) => {
    const [startA, endA] = parseDateTime(availabilityA);
    const [startB, endB] = parseDateTime(availabilityB);

    const overLapStart = Math.max(startA, startB);
    const overLapEnd = Math.min(endA, endB);

    if (overLapStart < overLapEnd) {
        return {
            startTime: Timestamp.fromDate(new Date(overLapStart)),
            endTime: Timestamp.fromDate(new Date(overLapEnd)),
        };
    }
    return null;
};