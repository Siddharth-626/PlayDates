import { LocationStorageType } from "@/utils/TYPE"
import { useEffect, useState } from "react"
import CustomDatePicker from "../commonComponents/Availability/DateSelector";
import LocationSelector from "@/components/commonComponents/Profile/LocationSelector";
import PreferencesSelector from "@/components/commonComponents/Profile/PreferencesSelector";
import { Calendar, Clock, Timer, MapPin, List, Plus, X } from "lucide-react";
import TimePicker from "../commonComponents/Availability/TimeSelector";
import DurationSelector from "../commonComponents/Availability/DurationSelector";
import { PlaymatePicker } from "../commonComponents/Players/PlayerSelector";
import { FiUserPlus } from "react-icons/fi";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/services/config";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { getEndTime } from "@/utils/Time/GetEndTime";
import { TeamsSelector } from "../commonComponents/Players/SelectTeams";



export const CreateMatch = ({ CloseTab }: { CloseTab: () => void }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [date, setDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    const [preference, setPreference] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationStorageType[]>([]);
    const [players, setPlayers] = useState<any[]>([{ userUid: user?.uid, profileId: selectedProfile?.id, status: "pending", name: selectedProfile?.name, photoUrl: selectedProfile?.photoUrl || "" }]);
    const [loading, setLoading] = useState(false);
    const [isAutoPlayerPickerSelected, setIsAutoPlayerPickerSelected] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [isTeamSelector, setIsTeamSelector] = useState(true);


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

    const endTime = getEndTime(duration, startTime);
    let status = "created";

    const handleAutoPlayerSector = () => {
        setIsAutoPlayerPickerSelected(!isAutoPlayerPickerSelected);
    }

    const host = {
        userUid: user?.uid,
        profileId: selectedProfile?.id,
        name: selectedProfile?.name
    }
    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!date || !locations[0] || !preference[0]) { toast.error("please enter all the fields"); setLoading(false); return };

            if (preference[0] == "Doubles" && players.length < 4 && !isAutoPlayerPickerSelected) {
                toast.error("You Need to select 4 Players To Play Doubles");
                return
            }
            const MatchData = {
                players: players,
                courtId: locations[0].courtId,
                date: Timestamp.fromDate(date),
                startTime: startTime || "",
                endTime: endTime || "",
                duration: duration || "",
                status: isAutoPlayerPickerSelected && players.length < numberOfPlayers ? "open" : "created",
                MatchType: preference[0],
                host: host
            }

            const MatchesColectionRef = collection(db, 'matches');
            await addDoc(MatchesColectionRef, MatchData);

            toast.success("match created");
            CloseTab();
        } catch (error) {
            toast.error("Failed to create match. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (players.length === 4) {
            setPreference(["Doubles"]);
        }
        if (players.length === 2) {
            setPreference(["Singles"]);
        }
    }, [players])
    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto shadow-lg border border-green-300 rounded-xl">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                Create a New Match
            </h2>

            {/* Responsive Grid */}
            <div className="flex flex-col gap-6">
                {/* Left: Match Schedule */}
                <motion.div
                    className="bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg border border-green-200 dark:border-green-700"
                >
                    {/* Header (Collapsible in mobile) */}
                    <button
                        onClick={() => setShowSchedule(!showSchedule)}
                        className="flex w-full justify-between items-center px-4 py-3"
                    >
                        <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                            <Calendar className="text-green-500" size={20} />
                            Match Schedule
                        </span>
                        <span>
                            {showSchedule ? <X size={18} /> : <Plus size={18} />}
                        </span>
                    </button>

                    {/* Content */}
                    {(showSchedule) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-4 px-4 pb-4"
                        >
                            {/* Date */}
                            <div className="flex items-center gap-3">
                                <Calendar className="text-green-500" size={18} />
                                <CustomDatePicker selectedDate={date} onChange={setDate} />
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-3">
                                <Clock className="text-blue-500" size={18} />
                                <TimePicker time={startTime} onChange={setStartTime} />
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-3">
                                <Timer className="text-purple-500" size={18} />
                                <DurationSelector duration={duration} onChange={setDuration} />
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right: Other Settings */}
                <div className="flex flex-col gap-6">

                    {/* Preferences */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                            <List size={18} className="text-yellow-500" /> Preferences
                        </label>
                        <PreferencesSelector
                            type="Match-Creation"
                            selected={preference}
                            onChange={SelectPreference}
                        />
                    </div>

                    {/* Location */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                            <MapPin size={18} className="text-pink-500" /> Location
                        </label>
                        <LocationSelector
                            type="Match-Creation"
                            selected={locations}
                            onChange={SelectLocation}
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                            <FiUserPlus size={18} className="text-green-500" /> Players
                        </label>
                        <PlaymatePicker
                            type="match"
                            OnAutoPlayerSelect={handleAutoPlayerSector}
                            isAutoPlayerPickerSelected={isAutoPlayerPickerSelected}
                            numberOfPlayers={numberOfPlayers}
                            selected={players}
                            onChange={SelectPlayers}
                        />
                    </div>
                    {players.length == 4 &&
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                                <FiUserPlus size={18} className="text-green-500" /> Select Teams
                            </label>
                            <TeamsSelector OnClose={() => {}} players={players} OnSubmit={(players) => setPlayers(players)} />;
                        </div>}
                </div>
            </div>

            {/* Create Button */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-2xl font-semibold shadow-md transition-all"
            >
                {loading ? (
                    <>
                        <Clock className="animate-spin" size={18} /> Creating...
                    </>
                ) : (
                    <>
                        <Plus size={20} /> Create Match
                    </>
                )}
            </motion.button>
        </div>
    );
}