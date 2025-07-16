import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { fetchAllProfileAvailability } from "@/utils/Availability/fetchAllProfileAvailability";
import { AvailabilityType } from "@/utils/TYPE"
import { Availability } from "../DateBasedAvilability/Main";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

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

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-600">Your Availability</h2>
                <button
                    onClick={() => setShowForm(prev => !prev)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                    {showForm ? "Close" : "Add Availability"}
                </button>
            </div>

            <AnimatePresence>{showForm && <Availability />}</AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 mt-6"
            >
                {availabilities.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-300">No availability added yet.</p>
                ) : (
                    availabilities.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="text-lg font-semibold text-green-700">
                                    {format(safeToDate(item.date), "PPP")} at {item.time}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Duration: {item.duration}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};
