import { Clock, Plus, Timer } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react"
import TimePicker from "../Availability/TimeSelector";
import DurationSelector from "../Availability/DurationSelector";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/config";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getEndTime } from "@/utils/Time/GetEndTime";


export const TimeSelctorPopUp = ({ matchId, onSubmit }: { matchId: any, onSubmit: Dispatch<SetStateAction<boolean>> }) => {
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async () => {
        if (!startTime || !duration) toast.error("Please Enter All the Fields")
        setLoading(true);
        const endTime = getEndTime(duration, startTime);
        const matchRef = doc(db, "matches", matchId);
    
        await updateDoc(matchRef, {
            status: "Time-Preposed",
            startTime: startTime,
            endTime: endTime
        })
        toast.success("Time Added");
        setLoading(false)
        onSubmit(false);
    }

    return (
        <div className="absolute right-0 z-50 mt-10 px-5 py-2 w-full max-w-xl border border-green-200 dark:border-green-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl animate-fade-in-down overflow-hidden">
            <div className="flex items-center gap-3 py-2">
                <span className="bg-green-50 dark:bg-green-950 p-1.5 rounded-lg flex items-center justify-center">
                    <Clock className="text-green-500" size={18} />
                </span>
                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{"Time (optional)"}</label>
                    <TimePicker time={startTime} onChange={setStartTime} />
                </div>
            </div>
            <div className="flex items-center gap-3 py-2">
                <span className="bg-blue-50 dark:bg-blue-950 p-1.5 rounded-lg flex items-center justify-center">
                    <Timer className="text-blue-500" size={18} />
                </span>
                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{"Duration (optional)"}</label>
                    <DurationSelector duration={duration} onChange={setDuration} />
                </div>

            </div>
            <div className="flex items-center gap-3 py-2">
                <div className="flex flex-col flex-1">
                    <motion.button
                        style={{ zIndex: 50 }}
                        whileHover={{ scale: 1.03, boxShadow: "0 2px 12px #22c55e33" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit()}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-full font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Clock className="animate-spin" size={18} />Adding...
                            </>
                        ) : (
                            <>
                                <Plus size={20} />Add Time
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}