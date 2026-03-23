import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { fetchAllProfileAvailability } from "@/utils/Availability/fetchAllProfileAvailability";
import { Availability } from "../DateBasedAvilability/Main";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Calendar, Clock, MapPin, List, Timer, Plus, X } from "lucide-react";
import { getTime } from "@/utils/Time/getTime";

const safeToDate = (input: Date | Timestamp): Date =>
    input instanceof Timestamp ? input.toDate() : input;

export const DisplayAvailability = () => {
    const [availabilities, setAvailability] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    useEffect(() => {
        const unsubscribe = fetchAllProfileAvailability(
            user?.uid,
            selectedProfile?.id,
            (av) => setAvailability(av)
        );
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user, selectedProfile]);

    const onCreate = () => setShowForm(false);

    return (
        <div className="min-h-screen bg-[#0d1b2a] p-4 md:p-6">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-[#22c55e]" />
                    <h2 className="text-[22px] font-bold text-white">My Calendar</h2>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22c55e] text-black font-bold text-sm shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
                >
                    {showForm ? (
                        <>
                            <X className="w-4 h-4" /> Close
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" /> Add Availability
                        </>
                    )}
                </motion.button>
            </div>

            {/* ── Add form ──────────────────────────────────────────── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="mb-6"
                    >
                        <Availability onCreate={onCreate} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Availability list ─────────────────────────────────── */}
            <div className="space-y-3">
                {availabilities.length === 0 ? (
                    <div className="flex flex-col items-center py-20 opacity-60">
                        <Calendar className="w-12 h-12 text-[#2d4a3e] mb-3" />
                        <p className="text-[#6b7280] font-medium">No availability added yet.</p>
                        <p className="text-sm text-[#4b5563] mt-1">
                            Tap "Add Availability" to get started.
                        </p>
                    </div>
                ) : (
                    availabilities.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="bg-[#111f2e] border border-[#1e3040] rounded-2xl overflow-hidden"
                        >
                            {/* Date header */}
                            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e3040] bg-[#0d1b2a]">
                                <Calendar className="w-4 h-4 text-[#22c55e] shrink-0" />
                                <span className="text-[#22c55e] font-bold text-[15px]">
                                    {format(safeToDate(item.date), "PPP")}
                                </span>
                                <span className="ml-auto text-[13px] text-[#94a3b8]">
                                    {getTime(item?.startDate)} – {getTime(item?.endDate)}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="px-4 py-3 space-y-2">
                                <div className="flex items-center gap-2.5">
                                    <Timer className="w-4 h-4 text-[#22c55e] shrink-0" />
                                    <span className="text-[13px] text-[#9ca3af]">Duration</span>
                                    <span className="ml-auto text-[14px] font-medium text-white">
                                        {item.duration}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <MapPin className="w-4 h-4 text-[#22c55e] shrink-0" />
                                    <span className="text-[13px] text-[#9ca3af]">Location</span>
                                    <span className="ml-auto text-[14px] font-medium text-white text-right">
                                        {item.locations?.length > 0
                                            ? item.locations.map((l: any) => l.name).join(", ")
                                            : "Not specified"}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <List className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                                    <span className="text-[13px] text-[#9ca3af]">Preferences</span>
                                    <span className="ml-auto text-[14px] font-medium text-white text-right">
                                        {item.preference?.length > 0
                                            ? item.preference.join(", ")
                                            : "None"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
