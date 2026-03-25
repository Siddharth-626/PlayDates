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

        const startDate = new Date(date);
        startDate.setHours(parsed.hours, parsed.minutes, 0, 0);

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

        toast.success("Time added!");
        setLoading(false);
        OnClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm px-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-inset)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)]/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-[var(--accent-green)]" />
                        </div>
                        <h2 className="text-[16px] font-bold text-[var(--content-primary)]">
                            Propose Match Time
                        </h2>
                    </div>
                    <button
                        onClick={OnClose}
                        className="p-2 rounded-lg hover:bg-[var(--border-subtle)] transition-colors text-[var(--content-muted)]"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
                    {/* Date Picker */}
                    <div>
                        <CustomDatePicker selectedDate={date} onChange={setDate} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[var(--border-subtle)]" />

                    {/* Time Picker */}
                    <TimePicker time={startTime} onChange={setStartTime} />

                    {/* Divider */}
                    <div className="border-t border-[var(--border-subtle)]" />

                    {/* Duration */}
                    <DurationSelector duration={duration} onChange={setDuration} />
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-5 py-4 border-t border-[var(--border-subtle)] bg-[var(--surface-inset)]">
                    <button
                        onClick={OnClose}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl border border-[var(--border-subtle)] text-[var(--content-secondary)] text-[14px] font-semibold hover:bg-[var(--surface-raised)] transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-[var(--accent-green)] text-white text-[14px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Clock className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        {loading ? "Adding..." : "Add Time"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
