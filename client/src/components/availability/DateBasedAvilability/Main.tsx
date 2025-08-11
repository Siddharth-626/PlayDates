import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DurationSelector from "../../commonComponents/Availability/DurationSelector";
import { motion } from "framer-motion";
import CustomDatePicker from "../../commonComponents/Availability/DateSelector";
import TimePicker from "../../commonComponents/Availability/TimeSelector";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { AddAvailability } from "@/utils/Availability/AddAvailability";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { AvailabilityType, courtType, LocationStorageType } from "@/utils/TYPE";
import LocationSelector from "@/components/commonComponents/Profile/LocationSelector";
import PreferencesSelector from "@/components/commonComponents/Profile/PreferencesSelector";
import { Calendar, Clock, Timer, MapPin, List } from "lucide-react";

export const Availability = ({onCreate}:{onCreate:()=>void}) => {
    const [loading, setloading] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [locations, setLocations] = useState<LocationStorageType[]>([]);
    const [preference, setPreference] = useState<string[]>([]);

    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const SelectLocation = (val: LocationStorageType[]) => {

        if (!val) return;
        setLocations(val);
    }
    const SelectPreference = (val: string[]) => {
        if (!val) return;
        setPreference(val);
    }
    const handleSubmit = async () => {
        setloading(true)
        if (!date || !time || !duration || !locations || !preference) { toast.error("please enter all the fields"); setloading(false); return };

        const AvailibilityId = uuidv4()
        const data = {
            id: AvailibilityId,
            date: Timestamp.fromDate(date),
            time: time,
            duration: duration,
            locations: locations,
            preference: preference || [],
        }
        await AddAvailability({
            userUid: user?.uid,
            profileId: selectedProfile?.id,
            data: data,
            AvailibilityId: AvailibilityId
        });
        toast.success("Availability added!")
        setloading(false);
        onCreate();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="max-w-lg mx-auto mt-10 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-6 space-y-2 border border-green-100 dark:border-green-800 hover:shadow-2xl transition-all duration-300"
        >
            <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-300 flex items-center justify-center gap-2 mb-4">
                <span>Set Your Availability</span> <span className="text-xl">🎾</span>
            </h2>

            <div className="space-y-1 divide-y divide-green-100 dark:divide-green-900">
                <div className="flex items-center gap-3 py-2">
                    <span className="bg-green-50 dark:bg-green-950 p-1.5 rounded-lg flex items-center justify-center">
                        <Calendar className="text-green-500" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Date</label>
                        <CustomDatePicker selectedDate={date} onChange={setDate} />
                    </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                    <span className="bg-green-50 dark:bg-green-950 p-1.5 rounded-lg flex items-center justify-center">
                        <Clock className="text-green-500" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Time</label>
                        <TimePicker time={time} onChange={setTime} />
                    </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                    <span className="bg-blue-50 dark:bg-blue-950 p-1.5 rounded-lg flex items-center justify-center">
                        <Timer className="text-blue-500" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Duration</label>
                        <DurationSelector duration={duration} onChange={setDuration} />
                    </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                    <span className="bg-yellow-50 dark:bg-yellow-950 p-1.5 rounded-lg flex items-center justify-center">
                        <List className="text-yellow-500" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Preferences</label>
                        <PreferencesSelector selected={preference} onChange={SelectPreference} />
                    </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                    <span className="bg-pink-50 dark:bg-pink-950 p-1.5 rounded-lg flex items-center justify-center">
                        <MapPin className="text-pink-500" size={18} />
                    </span>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Location</label>
                        <LocationSelector selected={locations} onChange={SelectLocation} />
                    </div>
                </div>
            </div>

            <motion.button
                style={{ zIndex: 50 }}
                whileHover={{ scale: 1.03, boxShadow: "0 2px 12px #22c55e33" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-full font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Clock className="animate-spin" size={18} /> Saving...
                    </>
                ) : (
                    <>
                        <Calendar size={18} /> Save Availability
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}