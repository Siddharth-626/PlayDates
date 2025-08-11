import { LocationStorageType } from "@/utils/TYPE"
import { useEffect, useState } from "react"
import CustomDatePicker from "../commonComponents/Availability/DateSelector";
import LocationSelector from "@/components/commonComponents/Profile/LocationSelector";
import PreferencesSelector from "@/components/commonComponents/Profile/PreferencesSelector";
import { Calendar, Clock, Timer, MapPin, List, Plus } from "lucide-react";
import TimePicker from "../commonComponents/Availability/TimeSelector";
import DurationSelector from "../commonComponents/Availability/DurationSelector";
import { PlaymatePicker } from "../commonComponents/Playmates/PlaymateSelector";
import { FiUserPlus } from "react-icons/fi";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/services/config";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { getEndTime } from "@/utils/Time/GetEndTime";


export const CreateMatch = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [date, setDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    const [preference, setPreference] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationStorageType[]>([]);
    const [players, setPlayers] = useState<any[]>([{ userUid: user?.uid, profileId: selectedProfile?.id,status:"accepted" }]);
    const [loading, setLoading] = useState(false);
    const SelectLocation = (val: LocationStorageType[]) => {
        setLocations(val)
    }
    const SelectPreference = (val: any[]) => {
        setPreference(val)
    }
    const SelectPlayers = (val: any[]) => {
        setPlayers(val);
    }
    const pref = typeof preference[0] === "string" ? preference[0].toLowerCase() : "";
    const numberOfPlayers = pref.includes("singles") ? 2 : 4;

    const endTime = getEndTime(duration,startTime);

    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!date || !locations || !preference) { toast.error("please enter all the fields"); setLoading(false); return };

            const MatchData = {
                players: players,
                courtId: locations[0].courtId,
                date: Timestamp.fromDate(date),
                startTime: startTime || "",
                endTime: endTime ||  "",
                status: "created",
                MatchType: preference[0],
            }

            const MatchesColectionRef = collection(db, 'matches');
            await addDoc(MatchesColectionRef, MatchData);

            toast.success("match created");

        } catch (error) {
            console.log("error while creating match ", error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-800">Create A New Match</span>
            <div className="px-2 py-2 shadow-2xl rounded-xl border border-green-300 ">
                <div className="flex ">
                    <div className=" mx-5 space-y-1 divide-y divide-green-100 dark:divide-green-900">
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

                    </div>
                    <div className="space-y-1 divide-y divide-green-100 dark:divide-green-900">
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
                        <div className="flex items-center gap-3 py-2">
                            <span className="bg-pink-50 dark:bg-pink-950 p-1.5 rounded-lg flex items-center justify-center">
                                <FiUserPlus className="text-pink-500" size={18} />
                            </span>
                            <div className="flex flex-col flex-1">
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Location</label>
                                <PlaymatePicker numberOfPlayers={numberOfPlayers} selected={players} onChange={SelectPlayers} />
                            </div>
                        </div>
                    </div>
                </div>
                <motion.button
                    style={{ zIndex: 50 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 2px 12px #22c55e33" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={()=> handleSubmit()
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-full font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Clock className="animate-spin" size={18} />Createing...
                        </>
                    ) : (
                        <>
                            <Plus size={20} />Create
                        </>
                    )}
                </motion.button>
            </div>

        </div>

    )
}