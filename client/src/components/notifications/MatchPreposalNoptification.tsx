import { fetchCourt } from "@/utils/courts/fetchCourt";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { MatchPreposalNotificationType, NotificationsType } from "@/utils/TYPE";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UsersRound, MapPin } from "lucide-react";
import { fetchMatch } from "@/utils/Match/fetchMatch";

type MatchPreposalNotificationProps = {
    note: NotificationsType;
    onRespond: (status: string, matchId: string) => void;
};

export const MatchPreposalNotification = ({ note, onRespond }: MatchPreposalNotificationProps) => {
    // Only render if it's a match proposal
    if (note.type !== "match proposal") return null;

    const { matchId } = note as MatchPreposalNotificationType;

    const [matchData, setMatchData] = useState<any>(null);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [court, setCourt] = useState<string>("");

    // Fetch match data
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

    if (!matchData) return <p className="text-sm text-gray-400">Loading Match Data...</p>;

    const { date, duration, startTime } = matchData;
    const formattedDate =
        typeof date === "string" ? new Date(date).toDateString() : date?.toDate()?.toDateString();
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl w-full mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-600 flex items-center gap-2">
                    🎾 Match Proposal
                </h2>
                <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100 rounded-full font-medium">
                    New
                </span>
            </div>

            <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                <p className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <strong className="min-w-[70px]">Court:</strong> {court}
                </p>
                <p className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4 text-green-600" />
                    <strong className="min-w-[70px]">Date:</strong> {formattedDate}
                </p>
                <p className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-green-600" />
                    <strong className="min-w-[70px]">Start Time:</strong> {startTime}
                </p>
                <p className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-green-600" />
                    <strong className="min-w-[70px]">Duration:</strong> {duration} mins
                </p>
                <div className="flex items-start gap-2 mb-4">
                    <UsersRound className="w-4 h-4 text-green-600 mt-1" />
                    <div>
                        <strong className="block mb-1">Players:</strong>
                        <ul className="list-disc list-inside space-y-1">
                            {playerNames.map((p, i) => (
                                <li key={i} className="ml-2">{p}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => onRespond("rejected", matchId)}
                    className="px-4 py-2 rounded-lg text-red-600 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition"
                >
                    Reject
                </button>
                <button
                    onClick={() => onRespond("accepted", matchId)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};
