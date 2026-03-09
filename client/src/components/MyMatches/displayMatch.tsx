import { fetchCourt } from "@/utils/courts/fetchCourt";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { MatchPreposalType } from "@/utils/TYPE";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UsersRound, MapPin, CheckCircle2, XCircle, Loader2, Edit2, Plus, Timer, Check, Send, User } from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";

import clsx from "clsx";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { Loading } from "../ui/Loading";
import { db } from "@/services/config";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { TimeSelctorPopUp } from "../commonComponents/Matches/timeSelctorPopUp";
import { GetTimeLeft } from "../commonComponents/Matches/getTimeLeft";
import { hasMatchEnded } from "@/utils/Time/hasMatchEnded";
import ScoreSelectorPopup from "../ScoreReporting/ScoreSelectorPoppup";
import { handleScoreSubmit } from "@/utils/Score/handleScoreSubmit";
import ScoreDisplay from "../ScoreReporting/displayScore";
import { TeamsSelector } from "../commonComponents/Players/SelectTeams";
import { FiUserPlus } from "react-icons/fi";
import { ChangeFieldInDb } from "@/utils/common/ChangeFieldInDb";
import { useRouter } from "next/router";
import { useChatDisplayData } from "@/context/chatDisplayDataContext";


type DisplayMatchProps = {
    match: MatchPreposalType;
    onRespond: (status: string, matchId: string) => void;
}

export const DisplayMatch = ({ match, onRespond }: DisplayMatchProps) => {
    const { matchId } = match;
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [matchData, setMatchData] = useState<any>(null);
    const [court, setCourt] = useState<string>("");
    const [isTimeDropdowmOpen, setIsTimeDropDownOpen] = useState(false);
    const [responseStatus, setResponseStatus] = useState<string>(match.status);
    const [isTimePreposed, setIsTimePreposed] = useState(false);
    const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);
    const [isTeamsPopupOpen, setIsTeamsPopupOpen] = useState(false);
    const [isDisplayMatch, setIsDisplayMatch] = useState(true);
    const router = useRouter();
    const { setChatDisplayData } = useChatDisplayData();
    if (!matchId) return;

    useEffect(() => {
        const unsubscribe = fetchMatch(matchId, (match) => setMatchData(match));
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [matchId]);

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
            const matchRef = doc(
                db,
                `users/${user?.uid}/profile/${selectedProfile?.id}/matches/${match.id}`
            );
            await updateDoc(matchRef, {
                status: status,
                isRead: true,
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
            setResponseStatus("Time");
        }
    }, [matchData]);

    useEffect(() => {
        setResponseStatus(match.status);
    }, [match.status]);

    const isHost = selectedProfile?.id == matchData?.host?.profileId;

    if (!matchData) return;
    const { date, startTime, MatchType, endTime, score, players } = matchData;

    const formattedDate =
        typeof date === "string"
            ? new Date(date).toDateString()
            : date?.toDate()?.toDateString();

    if (!date || !MatchType || !court || !players)
        return <Loading />;

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
        title = "Match Invite";
    }
    const isMatchEnded = isTimeGiven ? hasMatchEnded(date, endTime) : false;
    const isScore = isMatchEnded && !matchData.score;
    let team1 = MatchType == "Singles" ? `${players[0]?.name}` : `Team1`;
    let team2 = MatchType == "Singles" ? `${players[1]?.name}` : "Team2";

    if (MatchType == "Doubles") {
        for (let i = 0; i < players.length; i++) {
            players[i].team == "team1"
                ? (team1 += `(${players[i].name})`)
                : (team2 += `(${players[i].name})`);
        }
    }
    const handleChangeTeams = (players: any) => {
        ChangeFieldInDb("players", players, `matches/${matchId}`);
    };

    const handleChatClick = () => {
        setChatDisplayData({
            chatId: matchId,
            name: "Match Chat",
            photoUrl: "",
            players: players,
            type: "match"
        })
        router.push("/chats")
    }

    return (
        <div>
            {isDisplayMatch ? (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.97 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                     text-gray-900 dark:text-white rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100 dark:border-green-700 w-full"
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="text-lg sm:text-2xl font-bold text-green-700 flex items-center gap-2">
                            {title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                className="flex items-center px-2 py-2 rounded-full border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                                onClick={handleChatClick}
                                aria-label="Open match chat"
                            >
                                <Send className="text-blue-600" />
                            </button>

                            {!isTimeGiven && isHost && (
                                <button
                                    onClick={() => { setIsTimeDropDownOpen(!isTimeDropdowmOpen); setIsDisplayMatch(!DisplayMatch); }}
                                    className="flex items-center text-xs sm:text-sm px-3 py-1 rounded-full font-semibold 
                             text-yellow-700 border border-yellow-700 hover:bg-yellow-700 hover:text-white"
                                >
                                    <Plus size={14} className="mr-1" />
                                    {isTimeDropdowmOpen ? "Close" : "Add Time"}
                                </button>
                            )}

                            {startTime && (
                                <GetTimeLeft endTime={endTime} date={date} startTime={startTime} />
                            )}

                            {isScore && !score && isTimeGiven && (
                                <button
                                    onClick={() => {
                                        setIsDisplayMatch(!isDisplayMatch);
                                        setIsScoreDropdownOpen(!isScoreDropdownOpen);
                                    }}
                                    className="flex items-center text-xs sm:text-sm px-3 py-1 rounded-full font-semibold 
                             text-blue-600 border border-blue-700 hover:bg-blue-700 hover:text-white"
                                >
                                    <Plus size={14} className="mr-1" /> Add Score
                                </button>
                            )}

                            <span
                                className={clsx(
                                    "px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow",
                                    responseStatus === "pending" &&
                                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
                                    responseStatus === "accepted" &&
                                    "bg-green-600 text-white",
                                    responseStatus === "rejected" &&
                                    "bg-red-600 text-white"
                                )}
                            >
                                {responseStatus}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
                        {/* Left Column - Court & Time */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Court:</span>
                                <span>{court}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Date:</span>
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Start:</span>
                                <span>{startTime || "No Time provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">End:</span>
                                <span>{endTime || "No Time provided"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UsersRound className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Type:</span>
                                <span>{MatchType}</span>
                            </div>
                            {isMatchCreation && (
                                <div className="flex items-center gap-2">
                                    <UsersRound className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold">Host:</span>
                                    <span>{players?.[0]?.name || "No host"}</span>
                                </div>
                            )}
                        </div>

                        {/* Middle Column - Players */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <UsersRound className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Players:</span>
                                {MatchType == "Doubles" && (
                                    <button
                                        onClick={() => {
                                            setIsDisplayMatch(!isDisplayMatch);
                                            setIsTeamsPopupOpen(!isTeamsPopupOpen);
                                        }}
                                        className="flex items-center text-xs sm:text-sm px-3 py-1 rounded-full font-semibold 
                                text-blue-600 border border-blue-700 hover:bg-blue-700 hover:text-white"
                                    >
                                        <UsersRound size={14} className="mr-1" />{" "}
                                        {isTeamsPopupOpen ? "Close" : "Change Teams"}
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-2">
                                {players.map((player: any, i: any) => (
                                    <li
                                        key={i}
                                        className="flex sm:flex-row sm:items-center gap-2 py-1 px-2 rounded-lg 
                                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {player.photoUrl ? (
                                            <img
                                                src={player.photoUrl}
                                                alt={player.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <span className="font-medium">{player.name}</span>
                                        {MatchType == "Doubles" && (
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-center
                        ${player.team === "team1"
                                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                        : player.team === "team2"
                                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {player.team}
                                            </span>
                                        )}
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-center
                                                ${player.status === "accepted"
                                                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                    : player.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {player.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column - Score */}
                        <div>
                            {score && (
                                <div className="mt-3">
                                    <ScoreDisplay
                                        score={score}
                                        teamNames={{ team1: team1, team2: team2 }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                        {responseStatus !== "rejected" && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleMatchResponse("rejected")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                                 text-red-600 border border-red-500 hover:bg-red-100 dark:hover:bg-red-900 font-semibold"
                            >
                                <XCircle className="w-5 h-5" /> Reject
                            </motion.button>
                        )}

                        {responseStatus !== "accepted" && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleMatchResponse("accepted")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                           bg-green-600 text-white hover:bg-green-700 font-semibold"
                            >
                                <CheckCircle2 className="w-5 h-5" /> Accept
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            ) : null}

            {/* Score Selector */}
            {isScoreDropdownOpen && (
                <ScoreSelectorPopup
                    isOpen={true}
                    onClose={() => {
                        setIsDisplayMatch(true);
                        setIsScoreDropdownOpen(false);
                    }}
                    onSubmit={(score: any) => {
                        handleScoreSubmit(score, matchId);
                    }}
                    teamNames={{ team1: team1, team2: team2 }}
                />
            )}

            {/* Teams Selector */}
            {isTeamsPopupOpen && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                        <FiUserPlus size={18} className="text-green-500" /> Select Teams
                    </label>
                    <TeamsSelector
                        OnClose={() => {
                            setIsDisplayMatch(true);
                            setIsTeamsPopupOpen(false);
                        }}
                        players={players}
                        OnSubmit={handleChangeTeams}
                    />
                </div>
            )}
            {isTimeDropdowmOpen && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                        <Clock size={18} className="text-green-500" /> Add Time
                    </label>
                    <TimeSelctorPopUp
                        matchId={matchId}
                        OnClose={() => {
                            setIsDisplayMatch(true);
                            setIsTimeDropDownOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};