import { hasMatchEnded } from "@/utils/Time/hasMatchEnded";
import { getTimeLeft } from "@/utils/Time/getTimeLeft";
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"


export const GetTimeLeft = ({ startTime,date,endTime}: { startTime: string,date:Date | null,endTime:string}) => {

    const [timeLeft,setTimeLeft] = useState<string | null>("");

    useEffect(()=>{

        const updateTime = ()=>{
            const time = getTimeLeft(startTime);
            setTimeLeft(time)
        }
        updateTime();

        const interval = setInterval(updateTime,1000);

        return ()=> clearInterval(interval);
    },[startTime])
    const isMatchEnded = hasMatchEnded(date,endTime)
    return (
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-800 px-4 py-2 rounded-xl text-lg font-semibold text-green-700 dark:text-green-200 shadow-md">
            <Clock className="w-6 h-6" />
            {!isMatchEnded? (<span>{timeLeft} left</span>):(<span>Match Ended</span>)}
        </div>
    )
}