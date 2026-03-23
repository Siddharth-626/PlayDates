import { hasMatchEnded } from "@/utils/Time/hasMatchEnded";
import { getTimeLeft } from "@/utils/Time/getTimeLeft";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Parse hours from a time-left string like "29h 45m", "2h 15m", "45m 30s"
function parseHoursLeft(timeStr: string | null): number {
    if (!timeStr) return 0;
    const hourMatch = timeStr.match(/(\d+)h/);
    const minMatch = timeStr.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours + mins / 60;
}

function getUrgencyStyle(hoursLeft: number, isEnded: boolean): string {
    if (isEnded) return "bg-[#1f2937] border-[#4b5563] text-[#9ca3af]";
    if (hoursLeft > 24) return "bg-[#1a3a2a] border-[#22c55e] text-[#22c55e]";
    if (hoursLeft > 6) return "bg-[#3a2a0a] border-[#f59e0b] text-[#fbbf24]";
    return "bg-[#3a0a0a] border-[#ef4444] text-[#fca5a5]";
}

export const GetTimeLeft = ({
    startTime,
    date,
    endTime,
}: {
    startTime: any;
    date: Date | null;
    endTime: any;
}) => {
    const [timeLeft, setTimeLeft] = useState<string | null>("");

    useEffect(() => {
        const update = () => setTimeLeft(getTimeLeft(startTime));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const isEnded = hasMatchEnded(date, endTime);
    const hoursLeft = parseHoursLeft(timeLeft);
    const urgencyStyle = getUrgencyStyle(hoursLeft, isEnded);

    return (
        <div
            className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-[12px] font-semibold ${urgencyStyle}`}
        >
            <Clock className="w-3.5 h-3.5" />
            {isEnded ? "Match Ended" : <span>{timeLeft} left</span>}
        </div>
    );
};
