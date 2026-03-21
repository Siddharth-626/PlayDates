// utils/time.ts
export const getTimeLeft = (startTime: any) => {
    if (!startTime || typeof startTime !== 'string') return null;

    const now = new Date();
    const isPM = /pm/i.test(startTime);
    const isAM = /am/i.test(startTime);
    const formattedStartTime = startTime.replace(/\s?(am|pm)\s?/i, "").trim();
    let [hours, minutes] = formattedStartTime.split(":").map(Number);

    if (isPM && hours !== 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1); // tomorrow
    }

    const diffMs = target.getTime() - now.getTime();
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0) {
        return "Started"
    }
    else if (hoursLeft > 0) {
        return `${hoursLeft}h ${minutesLeft}m`
    }
    else {
        return `${minutesLeft}m ${secondsLeft}s`
    }
};


