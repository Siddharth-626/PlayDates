import { Clock, Plus, Timer, X, Calendar } from "lucide-react";
import { useState } from "react";
import TimePicker from "../Availability/TimeSelector";
import DurationSelector from "../Availability/DurationSelector";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/services/config";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { parseTimeString } from "@/utils/Time/parseTimeString";
import CustomDatePicker from "../Availability/DateSelector";

const parseDurationToMinutes = (durationStr: string): number => {
    const lowerStr = durationStr.toLowerCase();
    if (lowerStr.includes("hour")) {
        const hours = parseFloat(lowerStr.split(" ")[0]);
        return Math.round(hours * 60);
    } else if (lowerStr.includes("min")) {
        const minutes = parseInt(lowerStr.split(" ")[0]);
        return minutes;
    }
    return 0;
};

export const TimeSelctorPopUp = ({
    OnClose,
    matchId,
}: {
    OnClose: () => void;
    matchId: string;
}) => {
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | null>(null);

    const handleSubmit = async () => {
        if (!startTime || !duration || !date) {
            toast.error("Please fill in all fields");
            return;
        }

        const parsed = parseTimeString(startTime);
        if (!parsed) {
            toast.error("Invalid time format");
            return;
        }

        // Build Timestamps
        const startDate = new Date(date);
        startDate.setHours(parsed.hours, parsed.minutes, 0, 0);

        // Validate: must be in the future
        if (startDate.getTime() <= Date.now()) {
            toast.error("Match must be scheduled in the future");
            return;
        }

        const durationMinutes = parseDurationToMinutes(duration);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

        setLoading(true);
        const matchRef = doc(db, "matches", matchId);

        await updateDoc(matchRef, {
            status: "Time-Preposed",
            startTime: Timestamp.fromDate(startDate),
            endTime: Timestamp.fromDate(endDate),
            date: Timestamp.fromDate(date),
        });

        toast.success("Time Added");
        setLoading(false);
        OnClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm px-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-5 text-gray-800 dark:text-gray-100"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="text-green-500" size={20} /> Propose Match Time
                    </h2>
                    <button
                        onClick={OnClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-100 dark:bg-green-950 p-2 rounded-lg">
                        <Calendar className="text-green-600" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Select Date
                        </label>
                        <CustomDatePicker selectedDate={date} onChange={setDate} />
                    </div>
                </div>

                {/* Time Picker */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-100 dark:bg-green-950 p-2 rounded-lg">
                        <Clock className="text-green-600" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Start Time
                        </label>
                        <TimePicker time={startTime} onChange={setStartTime} />
                    </div>
                </div>

                {/* Duration Picker */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-blue-100 dark:bg-blue-950 p-2 rounded-lg">
                        <Timer className="text-blue-600" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Duration
                        </label>
                        <DurationSelector duration={duration} onChange={setDuration} />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Clock className="animate-spin" size={18} />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus size={20} /> Add Time
                            </>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={OnClose}
                        disabled={loading}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-3 px-4 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2"
                    >
                        <X size={20} /> Cancel
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
