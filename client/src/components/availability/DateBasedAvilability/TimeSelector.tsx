// components/availability/TimePicker.tsx
import React from "react";

type Props = {
    time: string;
    onChange: (time: string) => void;
};

export default function TimePicker({ time, onChange }: Props) {
    return (
        <div className="w-full">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                Select Start Time
            </label>
            <input
                type="time"
                value={time}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 rounded-md border dark:bg-gray-800 dark:text-white"
            />
        </div>
    );
}
