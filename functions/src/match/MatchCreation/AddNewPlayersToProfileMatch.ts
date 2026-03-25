import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";
import { buildProfileMatchDoc } from "../../utils/matchTypes";

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

        const beforeIds = new Set(beforeMatchData.players.map((player: any) => (player.profileId)));

        const newPlayers = afterMatchData.players.filter((player: any) => (!beforeIds.has(player.profileId)));

        if (newPlayers.length === 0) return;

        const batch = db.batch();
        for (const player of newPlayers) {
            const { userUid, profileId } = player;
            const ref = db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`);
            batch.set(ref, buildProfileMatchDoc(matchId, afterMatchData, "pending"));
        }
        await batch.commit();
        console.log(`AddNewPlayersToProfileMatch: added ${newPlayers.length} new players to profile matches for match ${matchId}`);
    } catch (error) {
        console.error("AddNewPlayersToProfileMatch: error:", error);
    }
})