import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { admin } from "../utils/admin";

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

            const profileMatchSnap = await db.collection(`users/${userUid}/profile/${profileId}/matches/`).get();
            const Delections = profileMatchSnap.docs.map(doc => {
                const data = doc.data();
                return data.matchId === matchId ? doc.ref : null;
            });

            const deletions = Delections.filter(doc => doc !== null);

            if (deletions.length > 0) {
                await Promise.all(deletions.map(doc => doc.delete()));
                console.log(`Match with ID ${matchId} has been cleared from profile ${profileId} of user ${userUid}.`);
            }
        }
    }catch (error) {
        console.error("Error while clearing old profile matches:", error);
    }
})