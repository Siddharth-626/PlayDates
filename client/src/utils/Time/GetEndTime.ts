
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

export const getEndTime = (duration:string,startTime:string)=>{

    if(!startTime || !duration) return;
    const now = new Date();

    const [hours,minutes] = startTime.split(":").map(Number);

    const StartTime = new Date();

    StartTime.setHours(hours,minutes,0,0)

    const durationMinutes = parseDurationToMinutes(duration);

    const endTime = new Date(StartTime.getTime() + durationMinutes * 60 * 1000);

    return new Date(endTime.getTime()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

}