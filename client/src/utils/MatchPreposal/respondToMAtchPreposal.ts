import { db } from "@/services/config";
import { doc, runTransaction } from "firebase/firestore";

type respondToMatchPreposalType = {
    matchId: string;
    userUid: string | undefined;
    profileId: string | undefined;
    status: string;
}
export const respondToMatchPreposal = async({
    matchId,
    userUid,
    profileId,
    status
}: respondToMatchPreposalType) => {
    if (!matchId || !userUid || !profileId) return;

    const MatchRef = doc(db, "matches", matchId);

    await runTransaction(db, async (transaction) => {
        const matchSnap = await transaction.get(MatchRef);
        const matchData = matchSnap?.data();
        if (!matchData || !Array.isArray(matchData.players)) return;

        const updatedPlayers = matchData.players.map((player: any) => {
            if (player.userUid === userUid && player.profileId === profileId) {
                return { ...player, status: status };
            }
            return player;
        });

        const allAccepted = updatedPlayers.every((p: any) => p.status === "accepted" || p.status === "owner");
        const anyRejected = updatedPlayers.some((p: any) => p.status === "rejected");

        let matchStatus = matchData.status;
        if (allAccepted) {
            matchStatus = "accepted";
        } else if (anyRejected) {
            matchStatus = "rejected";
        }

        transaction.update(MatchRef, {
            players: updatedPlayers,
            status: matchStatus,
        });
    });
}
