import { fetchCourt } from "@/utils/courts/fetchCourt";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { MatchPreposalType } from "@/utils/TYPE";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UsersRound, MapPin, CheckCircle2, XCircle, Loader2, Edit2, Plus, Timer, Check } from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";

import clsx from "clsx";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { Loading } from "../ui/Loading";
import { db } from "@/services/config";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { TimeSelctorPopUp } from "../commonComponents/Matches/timeSelctorPopUp";
import { getTimeLeft } from "@/utils/Time/getTimeLeft";
import { GetTimeLeft } from "../commonComponents/Matches/getTimeLeft";

type DisplayMatchProps = {
    match: MatchPreposalType;
    onRespond: (status: string, matchId: string) => void;
}

export const DisplayMatch = ({ match, onRespond, }: DisplayMatchProps) => {
    const { matchId } = match;
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [matchData, setMatchData] = useState<any>(null);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [court, setCourt] = useState<string>("");
    const [isTimeDropdowmOpen, setIsTimeDropDownOpen] = useState(false);
    const [responseStatus, setResponseStatus] = useState<string>(match.status);
    const [isTimePreposed, setIsTimePreposed] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    if (!matchId) return;
    useEffect(() => {
        if (!matchId) return;
        const fetchMatchData = async () => {
            const data = await fetchMatch(matchId);
            if (data) setMatchData(data);
        };
        fetchMatchData();
    }, [matchId]);


    useEffect(() => {
        const fetchPlayers = async () => {
            if (!matchData?.players) return;
            const names = await Promise.all(
                matchData.players.map(async (player: any) => {
                    const playerData = await FetchPlayerProfile({
                        userUid: player.userUid,
                        profileId: player.profileId
                    });
                    return playerData?.name ?? "Unknown Player";
                })
            );
            setPlayerNames(names);
        };
        fetchPlayers();
    }, [matchData]);

    // Fetch court title
    useEffect(() => {
        const fetchCourtData = async () => {
            if (!matchData?.courtId) return;
            const courtData = await fetchCourt(matchData.courtId);
            setCourt(courtData?.title ?? "Unknown Court");
        };
        fetchCourtData();
    }, [matchData?.courtId]);

    const handleMatchResponse = async (status: string) => {
        try {
            if (!match.id) return;
            const matchRef = doc(db, `users/${user?.uid}/profile/${selectedProfile?.id}/matches/${match.id}`);
            await updateDoc(matchRef, {
                status: status,
                isRead: true
            });

            setResponseStatus(status);
            onRespond(status, matchId);
            setIsTimePreposed(false);
        } catch (error) {
            console.error("Failed to update match response:", error);
        }
    };
    useEffect(() => {
        if (matchData?.status == "Time-Preposed" && match.status == "Time-Preposed") {
            setIsTimePreposed(true);
            setResponseStatus("pending");
        }
    }, [matchData])

    useEffect(() => {
        setResponseStatus(match.status);
    }, [match.status]);

    const isHost = selectedProfile?.name == playerNames[0];

    if (!matchData) return;
    const { date, startTime, MatchType, endTime } = matchData;
    const formattedDate = typeof date === "string" ? new Date(date).toDateString() : date?.toDate()?.toDateString();
    if (!date || !MatchType || !court || !playerNames) return (
        <Loading />
    );

    // Match Creation Conditions
    let title = "Match Proposal";
    const isMatchCreation = match.type == "created match";
    let isTimeGiven = true;

    if (isMatchCreation) {

        title = "Match Creation";
        if (startTime == "" && endTime == "") {
            isTimeGiven = false;
        }

    }
    if (!isHost) {
        title = "Match Invite"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="bg-white/90 dark:bg-slate-900/80 rounded-3xl p-7 shadow-2xl border border-green-100 dark:border-green-700 transition-all duration-300  hover:shadow-xl w-full mx-auto backdrop-blur-lg"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-green-700 flex items-center gap-2">
                    <span className="text-2xl">🎾</span>{title}
                </h2>
                {isTimePreposed ? (<div className=" flex gap-1 text-md font-sans text-green-600 bg-white dark:bg-gray-900 px-3 py-2 shadow-xl rounded-xl">
                    <CheckCircle2 className="w-7 h-7" />The Time Has Been Alocated!
                </div>) : null}
                <div className="flex gap-2">
                    {!isTimeGiven && isHost ? (<button onClick={() => setIsTimeDropDownOpen(!isTimeDropdowmOpen)} className="flex text-xs text-yellow-500  px-4 py-1 rounded-full font-bold bg-transparent tracking-wide shadow hover:text-white hover:bg-yellow-700 text-white border border-yellow-700">
                        <Plus size={15} /> Add time
                    </button>) : null}
                    {isTimeDropdowmOpen ? (

                        <TimeSelctorPopUp onSubmit={setIsTimeDropDownOpen} matchId={matchId} />
                    ) : null}
                    {startTime && (
                        <GetTimeLeft endTime={endTime} date={date} startTime={startTime} />
                    )}
                    <span
                        className={clsx(
                            "text-xs px-4 py-1 rounded-full font-bold tracking-wide shadow",
                            {
                                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-300": responseStatus === "pending",
                                "bg-green-600 text-white border border-green-700": responseStatus === "accepted",
                                "bg-red-600 text-white border border-red-700": responseStatus === "rejected"
                            }
                        )}
                    >
                        {responseStatus === "pending"
                            ? "New"
                            : responseStatus.charAt(0).toUpperCase() + responseStatus.slice(1)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-gray-800 dark:text-gray-200">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Court:</span>
                        <span className="truncate">{court}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Date:</span>
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Start:</span>
                        <span>{startTime ? startTime : "No Time provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">End:</span>
                        <span>{endTime ? endTime : "No Time Provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Type:</span>
                        <span>{MatchType}</span>
                    </div>
                    {isMatchCreation ? (<div className="flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Host:</span>
                        <span>{playerNames ? playerNames[0] : "threre is no host"}</span>
                    </div>) : null}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Players:</span>
                    </div>
                    <ul className="list-disc list-inside ml-7 space-y-1">
                        {playerNames.map((name, i) => (
                            <li
                                key={i}
                                className="ml-2 flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                {/* Player Name */}
                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                    {name}
                                </span>

                                {/* Status Badge */}
                                <span
                                    className={`
                                        text-xs font-semibold px-2 py-0.5 rounded-full
                                        ${matchData.players[i].status === "accepted" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" :
                                            matchData.players[i].status === "pending" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300" :
                                                "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}
    `}
                                >
                                    {matchData.players[i].status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">
                {responseStatus !== "rejected" && (
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleMatchResponse("rejected")}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-red-600 border border-red-500 hover:bg-red-100 dark:hover:bg-red-900 font-semibold transition-all"
                    >
                        <XCircle className="w-5 h-5" /> Reject
                    </motion.button>
                )}

                {responseStatus !== "accepted" && (
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleMatchResponse("accepted")}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold transition-all"
                    >
                        <CheckCircle2 className="w-5 h-5" /> Accept
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};
