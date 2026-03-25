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
        <div className="min-h-screen p-4 md:p-6">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-[var(--accent-green)]" />
                    <h2 className="text-h3 font-bold text-[var(--content-primary)]">My Calendar</h2>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm"
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
                    <div className="flex flex-col items-center py-20 opacity-50">
                        <Calendar className="w-12 h-12 text-[var(--accent-green)] mb-3" />
                        <p className="text-body font-medium text-[var(--content-muted)]">No availability added yet.</p>
                        <p className="text-caption text-[var(--content-subtle)] mt-1">
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
                            className="card overflow-hidden"
                        >
                            {/* Date header */}
                            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-inset)]">
                                <Calendar className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                                <span className="text-[var(--accent-green)] font-bold text-[15px]">
                                    {format(safeToDate(item.date), "PPP")}
                                </span>
                                <span className="ml-auto text-[13px] text-[var(--content-muted)]">
                                    {getTime(item?.startDate)} – {getTime(item?.endDate)}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="px-4 py-3 space-y-2">
                                <div className="flex items-center gap-2.5">
                                    <Timer className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                                    <span className="text-[13px] text-[var(--content-muted)]">Duration</span>
                                    <span className="ml-auto text-[14px] font-medium text-[var(--content-primary)]">
                                        {item.duration}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <MapPin className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                                    <span className="text-[13px] text-[var(--content-muted)]">Location</span>
                                    <span className="ml-auto text-[14px] font-medium text-[var(--content-primary)] text-right">
                                        {item.locations?.length > 0
                                            ? item.locations.map((l: any) => l.name).join(", ")
                                            : "Not specified"}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <List className="w-4 h-4 text-[var(--accent-green)] shrink-0 mt-0.5" />
                                    <span className="text-[13px] text-[var(--content-muted)]">Preferences</span>
                                    <span className="ml-auto text-[14px] font-medium text-[var(--content-primary)] text-right">
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
