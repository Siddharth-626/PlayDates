import { fetchCourt } from "@/utils/courts/fetchCourt";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { MatchPreposalType } from "@/utils/TYPE";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    UsersRound,
    MapPin,
    CheckCircle2,
    XCircle,
    Plus,
    User,
    MoreVertical,
    MessageCircle,
} from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
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
};

// Standardized status badge
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        accepted: "bg-[#166534] border border-[#22c55e] text-[#22c55e]",
        pending: "bg-[#78350f] border border-[#f59e0b] text-[#fbbf24]",
        rejected: "bg-[#7f1d1d] border border-[#ef4444] text-[#fca5a5]",
        "match ended": "bg-[#1f2937] border border-[#4b5563] text-[#9ca3af]",
    };
    const cls = styles[status.toLowerCase()] ?? "bg-[#1f2937] border border-[#4b5563] text-[#9ca3af]";
    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-[11px] font-semibold", cls)}>
            {status}
        </span>
    );
}

// Metadata row
function MetaRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[#1e3040] last:border-b-0">
            <div className="flex items-center gap-2 text-[#9ca3af] text-[13px]">
                <span className="text-[#22c55e]">{icon}</span>
                {label}
            </div>
            <span className="text-[14px] font-medium text-white">{value}</span>
        </div>
    );
}

export const DisplayMatch = ({ match, onRespond }: DisplayMatchProps) => {
    const { matchId } = match;
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [matchData, setMatchData] = useState<any>(null);
    const [court, setCourt] = useState<string>("");
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const [responseStatus, setResponseStatus] = useState<string>(match.status);
    const [isTimePreposed, setIsTimePreposed] = useState(false);
    const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);
    const [isTeamsPopupOpen, setIsTeamsPopupOpen] = useState(false);
    const [isDisplayMatch, setIsDisplayMatch] = useState(true);
    const router = useRouter();
    const { setChatDisplayData } = useChatDisplayData();

    useEffect(() => {
        if (!matchId) return;
        const unsubscribe = fetchMatch(matchId, async (matchSnapshot) => {
            if (matchSnapshot?.players && Array.isArray(matchSnapshot.players)) {
                const playersWithNames = await Promise.all(
                    matchSnapshot.players.map(async (player: any) => {
                        if (!player.name && player.userUid && player.profileId) {
                            try {
                                const fetched = await FetchPlayerProfile({
                                    userUid: player.userUid,
                                    profileId: player.profileId,
                                });
                                return {
                                    ...player,
                                    name: fetched?.name || "Unknown",
                                    photoUrl: fetched?.photoUrl || player.photoUrl || "",
                                };
                            } catch {
                                return { ...player, name: "Unknown" };
                            }
                        }
                        return player;
                    })
                );
                setMatchData({ ...matchSnapshot, players: playersWithNames });
            } else {
                setMatchData(matchSnapshot);
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
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
            await updateDoc(matchRef, { status, isRead: true });
            setResponseStatus(status);
            onRespond(status, matchId);
            setIsTimePreposed(false);
        } catch (error) {
            console.error("Failed to update match response:", error);
        }
    };

    useEffect(() => {
        if (matchData?.status === "Time-Preposed" && match.status === "Time-Preposed") {
            setIsTimePreposed(true);
            setResponseStatus("Time");
        }
    }, [matchData]);

    useEffect(() => {
        setResponseStatus(match.status);
    }, [match.status]);

    if (!matchId) return null;
    if (!matchData) return null;

    const { date, MatchType, score, players } = matchData;
    const isHost = selectedProfile?.id === matchData?.host?.profileId;

    const safeTimeString = (val: any): string => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (val?.toDate)
            return val.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
        return String(val);
    };

    const rawStartTime = matchData.startTime;
    const rawEndTime = matchData.endTime;
    const startTime = safeTimeString(rawStartTime);
    const endTime = safeTimeString(rawEndTime);

    const formattedDate =
        typeof date === "string"
            ? new Date(date).toDateString()
            : date?.toDate?.()?.toDateString() ?? "";

    if (!date || !MatchType || !court || !players) return <Loading />;

    let title = "Match Proposal";
    const isMatchCreation = match.type === "created match";
    let isTimeGiven = true;

    if (isMatchCreation) {
        title = "Match Creation";
        if (!rawStartTime || !rawEndTime) isTimeGiven = false;
    }
    if (!isHost) title = "Match Invite";

    const isMatchEnded = isTimeGiven ? hasMatchEnded(date, rawEndTime) : false;
    const isScore = isMatchEnded && !matchData.score;

    let team1 = MatchType === "Singles" ? `${players[0]?.name}` : "Team 1";
    let team2 = MatchType === "Singles" ? `${players[1]?.name}` : "Team 2";

    if (MatchType === "Doubles") {
        for (let i = 0; i < players.length; i++) {
            players[i].team === "team1"
                ? (team1 += ` (${players[i].name})`)
                : (team2 += ` (${players[i].name})`);
        }
    }

    const handleChangeTeams = (updatedPlayers: any) => {
        ChangeFieldInDb("players", updatedPlayers, `matches/${matchId}`);
    };

    const handleChatClick = () => {
        setChatDisplayData({
            chatId: matchId,
            name: `Match Chat · ${court} · ${formattedDate}`,
            photoUrl: "",
            players,
            type: "match",
        });
        router.push("/chats");
    };

    return (
        <div>
            {isDisplayMatch && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#111f2e] border border-[#1e3a2e] rounded-2xl overflow-hidden shadow-lg"
                >
                    {/* ── Card Header ──────────────────────────────────── */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3040]">
                        <span className="text-[#22c55e] font-bold text-[15px]">{title}</span>
                        <div className="flex items-center gap-2">
                            {rawStartTime && (
                                <GetTimeLeft
                                    endTime={rawEndTime}
                                    date={date}
                                    startTime={rawStartTime}
                                />
                            )}
                            <StatusBadge
                                status={isMatchEnded ? "Match Ended" : responseStatus}
                            />
                            {/* Chat button */}
                            <button
                                onClick={handleChatClick}
                                className="p-1.5 rounded-lg hover:bg-[#1a2a3a] transition-colors"
                                title="Open match chat"
                            >
                                <MessageCircle className="w-4 h-4 text-[#94a3b8]" />
                            </button>
                        </div>
                    </div>

                    {/* ── Card Body ────────────────────────────────────── */}
                    <div className="px-5 py-4 space-y-1">
                        <MetaRow
                            icon={<MapPin className="w-4 h-4" />}
                            label="Court"
                            value={court}
                        />
                        <MetaRow
                            icon={<CalendarDays className="w-4 h-4" />}
                            label="Date"
                            value={formattedDate}
                        />
                        <MetaRow
                            icon={<Clock className="w-4 h-4" />}
                            label="Start"
                            value={startTime || "Not set"}
                        />
                        <MetaRow
                            icon={<Clock className="w-4 h-4" />}
                            label="End"
                            value={endTime || "Not set"}
                        />
                        <MetaRow
                            icon={<UsersRound className="w-4 h-4" />}
                            label="Type"
                            value={MatchType}
                        />
                        {isMatchCreation && (
                            <MetaRow
                                icon={<User className="w-4 h-4" />}
                                label="Host"
                                value={players?.[0]?.name || "Unknown"}
                            />
                        )}
                    </div>

                    {/* ── Players ──────────────────────────────────────── */}
                    <div className="px-5 pb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                                Players
                            </span>
                            {MatchType === "Doubles" && (
                                <button
                                    onClick={() => {
                                        setIsDisplayMatch(false);
                                        setIsTeamsPopupOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 text-[12px] font-semibold text-white border border-[#22c55e] px-3 py-1 rounded-full hover:bg-[#22c55e] hover:text-black transition-all"
                                >
                                    <UsersRound className="w-3.5 h-3.5" /> Change Teams
                                </button>
                            )}
                        </div>
                        <ul className="space-y-2">
                            {players.map((player: any, i: number) => (
                                <li key={i} className="flex items-center gap-3 h-10">
                                    {player.photoUrl ? (
                                        <img
                                            src={player.photoUrl}
                                            alt={player.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-[#22c55e] shrink-0"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#1a2a3a] border-2 border-[#2d4a3e] flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-[#6b7280]" />
                                        </div>
                                    )}
                                    <span className="text-[14px] font-medium text-white flex-1">
                                        {player.name}
                                    </span>
                                    {MatchType === "Doubles" && (
                                        <span
                                            className={clsx(
                                                "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                                                player.team === "team1"
                                                    ? "bg-[#166534] text-[#22c55e]"
                                                    : "bg-[#1e3a5f] text-[#60a5fa]"
                                            )}
                                        >
                                            {player.team}
                                        </span>
                                    )}
                                    <StatusBadge status={player.status || "pending"} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Score ────────────────────────────────────────── */}
                    {score && (
                        <div className="px-5 pb-4">
                            <ScoreDisplay score={score} teamNames={{ team1, team2 }} />
                        </div>
                    )}

                    {/* ── Card Footer / Actions ─────────────────────────── */}
                    <div className="px-5 py-3 border-t border-[#1e3040] flex flex-wrap items-center gap-2">
                        {isMatchEnded ? (
                            <>
                                <span className="text-[13px] italic text-[#4b5563] flex-1 text-center">
                                    Match ended — no actions available
                                </span>
                                {isScore && !score && (
                                    <button
                                        onClick={() => {
                                            setIsDisplayMatch(false);
                                            setIsScoreDropdownOpen(true);
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] text-black font-bold text-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Add Score
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                {!isTimeGiven && isHost && (
                                    <button
                                        onClick={() => {
                                            setIsDisplayMatch(false);
                                            setIsTimeDropdownOpen(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-[#fbbf24] border border-[#f59e0b] hover:bg-[#78350f] transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Time
                                    </button>
                                )}

                                {responseStatus !== "rejected" && (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleMatchResponse("rejected")}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#fca5a5] border border-[#ef4444] hover:bg-[#7f1d1d] transition-all"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </motion.button>
                                )}

                                {responseStatus !== "accepted" && (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleMatchResponse("accepted")}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold bg-[#22c55e] text-black shadow-[0_0_8px_rgba(34,197,94,0.3)] transition-all"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Accept
                                    </motion.button>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── Overlays ─────────────────────────────────────────────── */}
            {isScoreDropdownOpen && (
                <ScoreSelectorPopup
                    isOpen
                    onClose={() => {
                        setIsDisplayMatch(true);
                        setIsScoreDropdownOpen(false);
                    }}
                    onSubmit={(s: any) => handleScoreSubmit(s, matchId)}
                    teamNames={{ team1, team2 }}
                />
            )}

            {isTeamsPopupOpen && (
                <div className="bg-[#111f2e] rounded-2xl border border-[#1e3040] p-4 mt-2">
                    <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
                        <FiUserPlus className="text-[#22c55e]" /> Select Teams
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

            {isTimeDropdownOpen && (
                <div className="bg-[#111f2e] rounded-2xl border border-[#1e3040] p-4 mt-2">
                    <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
                        <Clock className="text-[#22c55e]" size={16} /> Add Time
                    </label>
                    <TimeSelctorPopUp
                        matchId={matchId}
                        OnClose={() => {
                            setIsDisplayMatch(true);
                            setIsTimeDropdownOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
