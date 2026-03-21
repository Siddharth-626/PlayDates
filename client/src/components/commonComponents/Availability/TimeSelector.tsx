import React from "react";

type Props = {
    time: string;
    onChange: (time: string) => void;
};

export default function TimePicker({ time, onChange }: Props) {
    // Parse existing value (supports "HH:MM", "H:MM AM/PM")
    let currentHour = "";
    let currentMinute = "";
    let currentPeriod = "AM";

    if (time) {
        const ampmMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (ampmMatch) {
            currentHour = ampmMatch[1];
            currentMinute = ampmMatch[2];
            currentPeriod = ampmMatch[3].toUpperCase();
        } else {
            // 24-hour format from <input type="time">
            const parts = time.split(":");
            if (parts.length === 2) {
                let h = parseInt(parts[0], 10);
                currentMinute = parts[1];
                if (h === 0) { currentHour = "12"; currentPeriod = "AM"; }
                else if (h < 12) { currentHour = String(h); currentPeriod = "AM"; }
                else if (h === 12) { currentHour = "12"; currentPeriod = "PM"; }
                else { currentHour = String(h - 12); currentPeriod = "PM"; }
            }
        }
    }

    const buildTimeString = (hour: string, minute: string, period: string) => {
        if (!hour || !minute) return "";
        return `${hour}:${minute} ${period}`;
    };

    const handleHourChange = (h: string) => {
        onChange(buildTimeString(h, currentMinute || "00", currentPeriod));
    };

    const handleMinuteChange = (m: string) => {
        onChange(buildTimeString(currentHour || "12", m, currentPeriod));
    };

    const handlePeriodChange = (p: string) => {
        onChange(buildTimeString(currentHour || "12", currentMinute || "00", p));
    };

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

    return (
        <div className="w-full">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                Select Start Time
            </label>
            <div className="flex items-center gap-2">
                <select
                    value={currentHour}
                    onChange={(e) => handleHourChange(e.target.value)}
                    className="flex-1 p-2 rounded-md border dark:bg-gray-800 dark:text-white"
                >
                    <option value="">Hr</option>
                    {hours.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <span className="text-lg font-bold text-gray-500">:</span>
                <select
                    value={currentMinute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className="flex-1 p-2 rounded-md border dark:bg-gray-800 dark:text-white"
                >
                    <option value="">Min</option>
                    {minutes.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <div className="flex rounded-md border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => handlePeriodChange("AM")}
                        className={`px-3 py-2 text-sm font-semibold transition-colors ${
                            currentPeriod === "AM"
                                ? "bg-green-600 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePeriodChange("PM")}
                        className={`px-3 py-2 text-sm font-semibold transition-colors ${
                            currentPeriod === "PM"
                                ? "bg-green-600 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        PM
                    </button>
                </div>
            </div>
        </div>
    );
}
