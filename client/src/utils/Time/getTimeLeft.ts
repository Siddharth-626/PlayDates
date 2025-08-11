// utils/time.ts
export const getTimeLeft = (startTime: string) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);

    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1); // tomorrow
    }

    const diffMs = target.getTime() - now.getTime();
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

    if(hoursLeft <= 0 && minutesLeft <= 0&& secondsLeft <= 0){
                return "Started"
            }
            else if(hoursLeft > 0){
               return `${hoursLeft}h ${minutesLeft}m`
            }
            else{
                return`${minutesLeft}m ${secondsLeft}s`
            }
};

