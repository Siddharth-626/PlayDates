import { onDocumentUpdated } from "firebase-functions/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

export const AddNewPlayersToProfileMatch = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1"
}, async (event) => {

    const beforeMatchData = event.data?.before.data();
    const afterMatchData = event.data?.after.data();
    const { matchId } = event.params;

    if (!beforeMatchData || !afterMatchData) return;
    const type = afterMatchData.status == "proposed" ? "match proposal" : "created match"

        const beforeIds = new Set(beforeMatchData.players.map((player:any) => (player.profileId)));

        const newPlayers = afterMatchData.players.filter((player:any) => (!beforeIds.has(player.profileId)));

        for (const player of newPlayers) {
            const { userUid, profileId } = player;


            const matchProposal = {
                type: type,
                matchId: matchId,
                isRead: false,
                status: "pending"
            };

            await db
                .doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`)
                .set(matchProposal);
    }
})