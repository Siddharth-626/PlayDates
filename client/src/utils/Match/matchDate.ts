type MatchLike = {
    status?: string;
    date?: any;
    startTime?: any;
    endTime?: any;
    matchDate?: any;
};

const toValidDate = (value: any): Date | null => {
    if (!value) return null;

    if (value?.toDate && typeof value.toDate === "function") {
        const parsed = value.toDate();
        return Number.isNaN(parsed?.getTime?.()) ? null : parsed;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "number" || typeof value === "string") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
};

export const getMatchCalendarDate = (match: MatchLike): Date | null => {
    return (
        toValidDate(match.date) ||
        toValidDate(match.startTime) ||
        toValidDate(match.endTime) ||
        toValidDate(match.matchDate) ||
        null
    );
};

const parseTimeText = (value: string): { hours: number; minutes: number } | null => {
    const text = value.trim();

    const ampm = text.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampm) {
        let hours = Number.parseInt(ampm[1], 10);
        const minutes = Number.parseInt(ampm[2], 10);
        const period = ampm[3].toUpperCase();

        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return { hours, minutes };
    }

    const twentyFour = text.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFour) {
        const hours = Number.parseInt(twentyFour[1], 10);
        const minutes = Number.parseInt(twentyFour[2], 10);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
        return { hours, minutes };
    }

    return null;
};

const combineDateAndTime = (baseDate: Date, timeValue: any): Date | null => {
    const direct = toValidDate(timeValue);
    if (direct) return direct;

    if (typeof timeValue !== "string") return null;
    const parsed = parseTimeText(timeValue);
    if (!parsed) return null;

    const result = new Date(baseDate);
    result.setHours(parsed.hours, parsed.minutes, 0, 0);
    return result;
};

const getMatchStartDateTime = (match: MatchLike): Date | null => {
    const startDateTime = toValidDate(match.startTime);
    if (startDateTime) return startDateTime;

    const baseDate = toValidDate(match.date) || toValidDate(match.matchDate);
    if (!baseDate) return null;

    return combineDateAndTime(baseDate, match.startTime) || baseDate;
};

const getMatchEndDateTime = (match: MatchLike): Date | null => {
    const endDateTime = toValidDate(match.endTime);
    if (endDateTime) return endDateTime;

    const baseDate = toValidDate(match.date) || toValidDate(match.matchDate);
    if (!baseDate) return null;

    return combineDateAndTime(baseDate, match.endTime) || getMatchStartDateTime(match) || baseDate;
};

export const floorToDay = (value: Date): Date => {
    const day = new Date(value);
    day.setHours(0, 0, 0, 0);
    return day;
};

export const isUpcomingMatch = (match: MatchLike, now: Date): boolean => {
    if (match.status !== "accepted") return false;

    const endDateTime = getMatchEndDateTime(match);
    if (endDateTime) return endDateTime.getTime() > now.getTime();

    const startDateTime = getMatchStartDateTime(match);
    if (startDateTime) return startDateTime.getTime() >= now.getTime();

    return false;
};

export const isPastMatch = (match: MatchLike, now: Date): boolean => {
    // Completed/expired matches are always past regardless of time
    if (match.status === "completed" || match.status === "expired") return true;

    if (match.status === "pending") return false;

    const endDateTime = getMatchEndDateTime(match);
    if (endDateTime) return endDateTime.getTime() <= now.getTime();

    const startDateTime = getMatchStartDateTime(match);
    if (startDateTime) return startDateTime.getTime() < now.getTime();

    return false;
};