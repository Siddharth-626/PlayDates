import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

export const AddNewPlayersToProfileMatch = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1"
}, async (event) => {
    try {
        const beforeMatchData = event.data?.before.data();
        const afterMatchData = event.data?.after.data();
        const { matchId } = event.params;

        if (!beforeMatchData || !afterMatchData) return;
        const type = afterMatchData.status == "proposed" ? "match proposal" : "created match"

        const beforeIds = new Set(beforeMatchData.players.map((player: any) => (player.profileId)));

        const newPlayers = afterMatchData.players.filter((player: any) => (!beforeIds.has(player.profileId)));

        if (newPlayers.length === 0) return;

        const batch = db.batch();
        for (const player of newPlayers) {
            const { userUid, profileId } = player;

            const matchProposal = {
                type: type,
                matchId: matchId,
                isRead: false,
                status: "pending"
            };

            const ref = db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`);
            batch.set(ref, matchProposal);
        }
        await batch.commit();
        console.log(`AddNewPlayersToProfileMatch: added ${newPlayers.length} new players to profile matches for match ${matchId}`);
    } catch (error) {
        console.error("AddNewPlayersToProfileMatch: error:", error);
    }
})