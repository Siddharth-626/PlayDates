import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { fetchAllProfileAvailability } from "@/utils/Availability/fetchAllProfileAvailability";
import { AvailabilityType } from "@/utils/TYPE";
import { Availability } from "../DateBasedAvilability/Main";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Calendar, Clock, MapPin, List, Timer } from "lucide-react";

const safeToDate = (input: Date | Timestamp): Date =>
    input instanceof Timestamp ? input.toDate() : input;

export const DisplayAvailability = () => {
    const [availabilities, setAvailability] = useState<AvailabilityType[]>([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    useEffect(() => {
        const fetchAvailability = async () => {
            const data = await fetchAllProfileAvailability(user?.uid, selectedProfile?.id);
            if (data) {
                setAvailability(data);
            }
        };
        fetchAvailability();
    }, [user, selectedProfile]);

    const onCreate=()=>{
        setShowForm(false)
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <Calendar className="text-green-500" size={28} /> Your Availability
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm(prev => !prev)}
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-2 rounded-xl font-semibold shadow transition-all flex items-center gap-2"
                >
                    {showForm ? (
                        <>
                            <Clock size={18} /> Close
                        </>
                    ) : (
                        <>
                            <Clock size={18} /> Add Availability
                        </>
                    )}
                </motion.button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                    >
                        <Availability onCreate={onCreate} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5 mt-6"
            >
                
                {availabilities.length === 0 ? (
                    <div className="flex flex-col items-center py-12 opacity-70">
                        <Calendar size={48} className="mb-2 text-green-300" />
                        <p className="text-gray-500 dark:text-gray-300 text-lg">No availability added yet.</p>
                    </div>
                ) : (
                    availabilities.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            whileHover={{ scale: 1.015, boxShadow: "0 4px 24px #22c55e22" }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-100 dark:border-green-700 p-5 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="text-green-500" size={20} />
                                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                                        {format(safeToDate(item.date), "PPP")}
                                    </span>
                                    <Clock className="ml-4 text-green-400" size={18} />
                                    <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                        {item.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Timer className="text-blue-400" size={18} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        Duration: <span className="font-semibold">{item.duration}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mb-1">
                                    <MapPin className="text-pink-400" size={18} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        Location: <span className="font-semibold">
                                            {item.locations && item.locations.length > 0
                                                ? item.locations.map(loc => loc.name).join(", ")
                                                : "Not specified"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <List className="text-yellow-400" size={18} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        Preferences: <span className="font-semibold">
                                            {item.preference && item.preference.length > 0
                                                ? item.preference.join(", ")
                                                : "None"}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};
