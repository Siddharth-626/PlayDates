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
    MessageCircle,
} from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";
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
    onRespond: (status: string, matchId: string) => Promise<void>;
};

// Standardized status badge
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        accepted: "badge-green",
        pending: "badge-gold",
        rejected: "bg-red-950/60 border border-red-600/50 text-red-400",
        "match ended": "bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--content-muted)]",
    };
    const cls = styles[status.toLowerCase()] ?? "bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--content-muted)]";
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
            {status}
        </span>
    );
}

// Metadata row
function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-b-0">
            <div className="flex items-center gap-2 text-[var(--content-muted)] text-[13px]">
                <span className="text-[var(--accent-green)]">{icon}</span>
                {label}
            </div>
            <span className="text-[14px] font-medium text-[var(--content-primary)]">{value}</span>
        </div>
    );
}

// Single player row helper
function PlayerRow({ player, showStatus = true }: { player: any; showStatus?: boolean }) {
    return (
        <div className="flex items-center gap-2 py-1">
            {player.photoUrl ? (
                <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[var(--accent-green)] shrink-0"
                />
            ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--surface-inset)] border-2 border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-[var(--content-muted)]" />
                </div>
            )}
            <span className="text-[13px] font-medium text-[var(--content-primary)] flex-1 truncate">
                {player.name}
            </span>
            {showStatus && <StatusBadge status={player.status || "pending"} />}
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
            if (!match.id || !user?.uid || !selectedProfile?.id) return;
            await onRespond(status, matchId);
            const matchRef = doc(
                db,
                `users/${user.uid}/profile/${selectedProfile.id}/matches/${match.id}`
            );
            await updateDoc(matchRef, { status, isRead: true });
            setResponseStatus(status);
            setIsTimePreposed(false);
        } catch (error) {
            console.error("Failed to update match response:", error);
        }
    };

    useEffect(() => {
        const isTimeProposed = (s: string | undefined) =>
            s === "time_proposed" || s === "Time-Preposed";
        if (isTimeProposed(matchData?.status) && isTimeProposed(match.status)) {
            setIsTimePreposed(true);
            setResponseStatus("Time");
        }
        if (matchData?.status === "accepted" || matchData?.status === "rejected" || matchData?.status === "completed") {
            setResponseStatus(matchData.status);
        }
    }, [matchData?.status]);

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
    const isMatchCreation = match.type === "created match" || match.type === "created_match";
    let isTimeGiven = true;

    if (isMatchCreation) {
        title = "Match Creation";
        if (!rawStartTime || !rawEndTime) isTimeGiven = false;
    }
    if (!isHost) title = "Match Invite";

    const isMatchEnded = isTimeGiven ? hasMatchEnded(date, rawEndTime) : false;
    // item 20: hide button if score already exists; show "Enter Final Score" if no score
    const hasScore = !!matchData.score;
    const showScoreButton = isMatchEnded && !hasScore;
    const isMatchFinalized = matchData?.status === "accepted" || matchData?.status === "rejected";

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

    // item 21: split players into teams for Doubles
    const team1Players = players.filter((p: any) => p.team === "team1");
    const team2Players = players.filter((p: any) => p.team === "team2");

    return (
        <div>
            {isDisplayMatch && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="card rounded-2xl overflow-hidden"
                    style={{
                        borderLeft: isMatchEnded
                            ? "4px solid var(--border-default)"
                            : responseStatus === "accepted"
                                ? "4px solid var(--accent-green)"
                                : responseStatus === "pending"
                                    ? "4px solid var(--accent-gold)"
                                    : "4px solid var(--border-default)",
                    }}
                >
                    {/* ── Card Header ──────────────────────────────────── */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
                        <span className="text-[var(--accent-green)] font-bold text-[15px]">{title}</span>
                        <div className="flex items-center gap-2">
                            {/* Show timer only when match hasn't ended */}
                            {rawStartTime && !isMatchEnded && (
                                <GetTimeLeft
                                    endTime={rawEndTime}
                                    date={date}
                                    startTime={rawStartTime}
                                />
                            )}
                            {/* Single status badge (item 19) */}
                            <StatusBadge status={isMatchEnded ? "Match Ended" : responseStatus} />
                            {/* Chat button */}
                            <button
                                onClick={handleChatClick}
                                className="p-1.5 rounded-lg hover:bg-[var(--surface-inset)] transition-colors"
                                title="Open match chat"
                            >
                                <MessageCircle className="w-4 h-4 text-[var(--content-muted)]" />
                            </button>
                        </div>
                    </div>

                    {/* ── Card Body ────────────────────────────────────── */}
                    <div className="px-5 py-4 space-y-1">
                        <MetaRow icon={<MapPin className="w-4 h-4" />} label="Court" value={court} />
                        <MetaRow icon={<CalendarDays className="w-4 h-4" />} label="Date" value={formattedDate} />
                        <MetaRow icon={<Clock className="w-4 h-4" />} label="Start" value={startTime || "Not set"} />
                        <MetaRow icon={<Clock className="w-4 h-4" />} label="End" value={endTime || "Not set"} />
                        <MetaRow icon={<UsersRound className="w-4 h-4" />} label="Type" value={MatchType} />
                        {isMatchCreation && (
                            <MetaRow icon={<User className="w-4 h-4" />} label="Host" value={players?.[0]?.name || "Unknown"} />
                        )}
                    </div>

                    {/* ── Players ──────────────────────────────────────── */}
                    <div className="px-5 pb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[13px] font-semibold text-[var(--content-muted)] uppercase tracking-wider">
                                Players
                            </span>
                            {MatchType === "Doubles" && (
                                <button
                                    onClick={() => { setIsDisplayMatch(false); setIsTeamsPopupOpen(true); }}
                                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--content-primary)] border border-[var(--accent-green)] px-3 py-1 rounded-full hover:bg-[var(--accent-green)] hover:text-[var(--surface-base)] transition-all"
                                >
                                    <UsersRound className="w-3.5 h-3.5" /> Change Teams
                                </button>
                            )}
                        </div>

                        {/* item 21: Doubles two-column team visualization */}
                        {MatchType === "Doubles" ? (
                            <div className="grid grid-cols-2 gap-3">
                                {/* Team 1 */}
                                <div className="border-l-2 border-[var(--accent-green)] pl-3 space-y-1">
                                    <p className="text-[11px] font-bold text-[var(--accent-green)] uppercase tracking-wide mb-1.5">Team 1</p>
                                    {(team1Players.length > 0 ? team1Players : players.filter((_: any, i: number) => i % 2 === 0)).map((player: any, i: number) => (
                                        <PlayerRow key={i} player={player} showStatus />
                                    ))}
                                    {team1Players.length === 0 && (
                                        <p className="text-[12px] text-[var(--content-muted)] italic">Not assigned</p>
                                    )}
                                </div>
                                {/* Team 2 */}
                                <div className="border-l-2 border-blue-500/70 pl-3 space-y-1">
                                    <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wide mb-1.5">Team 2</p>
                                    {(team2Players.length > 0 ? team2Players : players.filter((_: any, i: number) => i % 2 === 1)).map((player: any, i: number) => (
                                        <PlayerRow key={i} player={player} showStatus />
                                    ))}
                                    {team2Players.length === 0 && (
                                        <p className="text-[12px] text-[var(--content-muted)] italic">Not assigned</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Singles: simple list
                            <ul className="space-y-2">
                                {players.map((player: any, i: number) => (
                                    <li key={i}>
                                        <PlayerRow player={player} showStatus />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ── Score ────────────────────────────────────────── */}
                    {score && (
                        <div className="px-5 pb-4">
                            <ScoreDisplay score={score} teamNames={{ team1, team2 }} />
                        </div>
                    )}

                    {/* ── Card Footer / Actions ─────────────────────────── */}
                    <div className="px-5 py-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
                        {isMatchEnded ? (
                            <>
                                {/* item 20: Only show "Enter Final Score" if no score exists; hide if score present */}
                                {showScoreButton ? (
                                    <button
                                        onClick={() => { setIsDisplayMatch(false); setIsScoreDropdownOpen(true); }}
                                        className="btn-primary flex items-center gap-1.5 text-sm flex-1 justify-center"
                                    >
                                        <Plus className="w-4 h-4" /> Enter Final Score
                                    </button>
                                ) : (
                                    <span className="text-[13px] italic text-[var(--content-muted)] flex-1 text-center">
                                        {hasScore ? "Score recorded" : "Match ended"}
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                {!isTimeGiven && isHost && (
                                    <button
                                        onClick={() => { setIsDisplayMatch(false); setIsTimeDropdownOpen(true); }}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-[var(--accent-gold)] border border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Time
                                    </button>
                                )}

                                {isMatchFinalized ? (
                                    <span className="text-[13px] font-semibold flex-1 text-center" style={{ color: matchData.status === "accepted" ? "var(--accent-green)" : "var(--content-muted)" }}>
                                        Match {matchData.status}
                                    </span>
                                ) : (
                                    <>
                                        {responseStatus !== "rejected" && (
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleMatchResponse("rejected")}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-red-400 border border-red-600/50 hover:bg-red-950/50 transition-all"
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </motion.button>
                                        )}
                                        {responseStatus !== "accepted" && (
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleMatchResponse("accepted")}
                                                className="btn-primary flex items-center gap-1.5 text-[13px]"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Accept
                                            </motion.button>
                                        )}
                                    </>
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
                    onClose={() => { setIsDisplayMatch(true); setIsScoreDropdownOpen(false); }}
                    onSubmit={(s: any) => handleScoreSubmit(s, matchId, user?.uid)}
                    teamNames={{ team1, team2 }}
                />
            )}

            {isTeamsPopupOpen && (
                <div className="card rounded-2xl p-4 mt-2">
                    <label className="flex items-center gap-2 text-[var(--content-primary)] mb-3 font-semibold text-sm">
                        <FiUserPlus className="text-[var(--accent-green)]" /> Select Teams
                    </label>
                    <TeamsSelector
                        OnClose={() => { setIsDisplayMatch(true); setIsTeamsPopupOpen(false); }}
                        players={players}
                        OnSubmit={handleChangeTeams}
                    />
                </div>
            )}

            {isTimeDropdownOpen && (
                <div className="card rounded-2xl p-4 mt-2">
                    <label className="flex items-center gap-2 text-[var(--content-primary)] mb-3 font-semibold text-sm">
                        <Clock className="text-[var(--accent-green)]" size={16} /> Add Time
                    </label>
                    <TimeSelctorPopUp
                        matchId={matchId}
                        OnClose={() => { setIsDisplayMatch(true); setIsTimeDropdownOpen(false); }}
                    />
                </div>
            )}
        </div>
    );
};
