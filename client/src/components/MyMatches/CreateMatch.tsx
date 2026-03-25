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
import { parseTimeString } from "@/utils/Time/parseTimeString";
import { TeamsSelector } from "../commonComponents/Players/SelectTeams";

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
            if (!date || !locations[0] || !preference[0]) { toast.error("Please enter all the fields"); setLoading(false); return };

            if (preference[0] == "Doubles" && players.length < 4 && !isAutoPlayerPickerSelected) {
                toast.error("You Need to select 4 Players To Play Doubles");
                setLoading(false);
                return
            }

            // Parse time and build Timestamps
            const parsed = parseTimeString(startTime);
            let startTimestamp: Timestamp | null = null;
            let endTimestamp: Timestamp | null = null;

            if (parsed && duration) {
                const startDate = new Date(date);
                startDate.setHours(parsed.hours, parsed.minutes, 0, 0);

                // Validate: match must be in the future
                if (startDate.getTime() <= Date.now()) {
                    toast.error("Match must be scheduled in the future");
                    setLoading(false);
                    return;
                }

                const durationMinutes = parseDurationToMinutes(duration);
                const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

                startTimestamp = Timestamp.fromDate(startDate);
                endTimestamp = Timestamp.fromDate(endDate);
            }

            const MatchData: any = {
                players: players,
                courtId: locations[0].courtId,
                date: Timestamp.fromDate(date),
                startTime: startTimestamp || "",
                endTime: endTimestamp || "",
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
        <div className="flex flex-col gap-5 p-4 md:p-6 max-w-2xl mx-auto">
            {/* Title */}
            <h2 className="text-h2 font-bold text-[var(--content-primary)] text-center">
                Create a New Match
            </h2>

            {/* Responsive Grid */}
            <div className="flex flex-col gap-6">
                {/* Left: Match Schedule */}
                <div className="card">
                    {/* Header (Collapsible in mobile) */}
                    <button
                        onClick={() => setShowSchedule(!showSchedule)}
                        className="flex w-full justify-between items-center px-4 py-3"
                    >
                        <span className="flex items-center gap-2 font-semibold text-[var(--content-primary)]">
                            <Calendar className="text-[var(--accent-green)]" size={20} />
                            Match Schedule
                        </span>
                        <span className="" onClick={() => setShowSchedule(!showSchedule)}>
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
                                <Calendar className="text-[var(--accent-green)]" size={18} />
                                <CustomDatePicker selectedDate={date} onChange={setDate} />
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-3">
                                <Clock className="text-[var(--accent-green)]" size={18} />
                                <TimePicker time={startTime} onChange={setStartTime} />
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-3">
                                <Timer className="text-[var(--accent-green)]" size={18} />
                                <DurationSelector duration={duration} onChange={setDuration} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Other Settings */}
                <div className="flex flex-col gap-6">

                    {/* Preferences */}
                    <div className="card p-4">
                        <label className="flex items-center gap-2 text-[var(--content-primary)] mb-2 font-semibold">
                            <List size={18} className="text-[var(--accent-green)]" /> Preferences
                        </label>
                        <PreferencesSelector
                            type="Match-Creation"
                            selected={preference}
                            onChange={SelectPreference}
                        />
                    </div>

                    {/* Location */}
                    <div className="card p-4">
                        <label className="flex items-center gap-2 text-[var(--content-primary)] mb-2 font-semibold">
                            <MapPin size={18} className="text-[var(--accent-green)]" /> Location
                        </label>
                        <LocationSelector
                            type="Match-Creation"
                            selected={locations}
                            onChange={SelectLocation}
                        />
                    </div>
                    <div className="card p-4">
                        <label className="flex items-center gap-2 text-[var(--content-primary)] mb-2 font-semibold">
                            <FiUserPlus size={18} className="text-[var(--accent-green)]" /> Players
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
                        <div className="card p-4">
                            <label className="flex items-center gap-2 text-[var(--content-primary)] mb-2 font-semibold">
                                <FiUserPlus size={18} className="text-[var(--accent-green)]" /> Select Teams
                            </label>
                            <TeamsSelector OnClose={() => {}} players={players} OnSubmit={(players) => setPlayers(players)} />;
                        </div>}
                </div>
            </div>

            {/* Create Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
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
            </button>
        </div>
    );
}
