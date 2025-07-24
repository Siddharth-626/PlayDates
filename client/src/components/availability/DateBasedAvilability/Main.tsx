import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DurationSelector from "./DurationSelector";
import { motion } from "framer-motion";
import CustomDatePicker from "./DateSelector";
import TimePicker from "./TimeSelector";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { AddAvailability } from "@/utils/Availability/AddAvailability";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { AvailabilityType, courtType, LocationStorageType } from "@/utils/TYPE";
import LocationSelector from "@/components/profile/SetupProfile/LocationSelector";
import PreferencesSelector from "@/components/profile/SetupProfile/PreferencesSelector";

export const Availability = () => {
    const [loading, setloading] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [AvailabilityData, setAvalabilityData] = useState<AvailabilityType>();
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
        if (!date || !time || !duration || !locations) { toast.error("please enter all the fields"); setloading(false); return };

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
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="max-w-xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-green-600">
                    Set Your Availability 🎾
                </h2>

                <CustomDatePicker selectedDate={date} onChange={setDate} />
                <TimePicker time={time} onChange={setTime} />
                <DurationSelector duration={duration} onChange={setDuration} />
                <PreferencesSelector selected={preference} onChange={SelectPreference} />
                <LocationSelector selected={locations} onChange={SelectLocation} />
                <button
                    style={{ zIndex: 50 }}
                    onClick={handleSubmit}
                    className="relative w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200"
                >
                    {loading ? "Saving....." : "Save Availability"}
                </button>

            </motion.div>
        </>
    );
}