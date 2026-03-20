import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();
export const clearOldProfileMatches = onDocumentDeleted({
    document: "matches/{matchId}",
    region: "asia-south1",
}, async (event) => {
    try {
        const { matchId } = event.params;
        const matchData = event.data?.data();
        if (!matchData) return;

        const players = matchData.players || [];

        for(const player of players) {
            const { userUid, profileId } = player;

            const profileMatchSnap = await db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`).get();
           await profileMatchSnap.ref.delete()
        }
    }catch (error) {
        console.error("Error while clearing old profile matches:", error);
    }
})