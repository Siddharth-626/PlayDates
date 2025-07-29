import { fetchCourt } from "@/utils/courts/fetchCourt";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { MatchPreposalType } from "@/utils/TYPE";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UsersRound, MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";

import clsx from "clsx";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { Loading } from "../ui/Loading";
import { db } from "@/services/config";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";

interface MatchPreposalNotificationProps {
    match: MatchPreposalType;
    onRespond: (status: string, matchId: string) => void;
}

export const DisplayMatchePreposal = ({ match, onRespond }: MatchPreposalNotificationProps) => {
    const { matchId } = match;
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [matchData, setMatchData] = useState<any>(null);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [court, setCourt] = useState<string>("");
    const [responseStatus, setResponseStatus] = useState<string>(match.status);

    // Fetch match data
    if (!matchId) return;
    useEffect(() => {
        if (!matchId) return;
        const fetchMatchData = async () => {
            const data = await fetchMatch(matchId);
            if (data) setMatchData(data);
        };
        fetchMatchData();
    }, [matchId]);

    // Fetch player names
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
    }, [matchData?.players]);

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
        if (!match.id) return;
        const matchRef = doc(db, `users/${user?.uid}/profile/${selectedProfile?.id}/matches/${match.id}`);
        await updateDoc(matchRef, {
            status: status,
            isRead: true
        })

        setResponseStatus(status);
        onRespond(status, matchId);
    };

    useEffect(()=>{
        setResponseStatus(match.status);
    },[match.status]);

    if (!matchData) return;

    const { date, startTime, MatchType, endTime } = matchData;
    const formattedDate = typeof date === "string" ? new Date(date).toDateString() : date?.toDate()?.toDateString();
    if (!date || !startTime || !MatchType || !endTime || !court || !playerNames) return (
        <Loading />
    );

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
                    <span className="text-2xl">🎾</span> Match Proposal
                </h2>
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
                        <span>{startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">End:</span>
                        <span>{endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Type:</span>
                        <span>{MatchType}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Players:</span>
                    </div>
                    <ul className="list-disc list-inside ml-7 space-y-1">
                        {playerNames.map((name, i) => (
                            <li key={i} className="ml-2">{name}</li>
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
