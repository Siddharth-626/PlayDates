import { useAuth } from "@/context/authContext";
import { db } from "@/services/config";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Availability = {
    [day: string]: { start: string; end: string } | null;
}

 const AvailabilitySelector = () => {
    const [availability, setAvailability] = useState<Availability>({});
    const { user } = useAuth();

    const toggleDay = (day: string) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: prev[day] ? null : { start: '8:00', end: '10:00' }
        }))
    }
    const saveAvailability = () => {
        if(!user?.uid)return;
        setDoc(doc(db, `users/${user.uid}/availability/profile`),availability)

    }
    const handleTimeChange = (
        day: string,
        type: 'start' | 'end',
        value: string
    ) => {
        setAvailability((prev) => {
            const existing = prev[day];

            if (!existing) {
                return {
                    ...prev,
                    [day]: {
                        start: type === 'start' ? value : '08:00',
                        end: type === 'end' ? value : '10:00',
                    },
                };
            }

            return {
                ...prev,
                [day]: {
                    ...existing,
                    [type]: value,
                },
            };
        });
    };
    return (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">My Weekly Availability</h2>

            {days.map((day) => (
                <div
                    key={day}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                >
                    <button
                        onClick={() => toggleDay(day)}
                        className={`w-12 h-12 rounded-full text-sm font-medium ${availability[day]
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                    >
                        {day}
                    </button>

                    {availability[day] && (
                        <div className="flex space-x-2">
                            <input
                                type="time"
                                value={availability[day]?.start || ""}
                                onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                                className="p-1 rounded border border-green-300 text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                            <span className="text-gray-600 dark:text-gray-300">to</span>
                            <input
                                type="time"
                                value={availability[day]?.end || ""}
                                onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                                className="p-1 rounded border border-green-300 text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={saveAvailability}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
                Save Availability
            </button>
        </div>
    );
}
export default AvailabilitySelector;