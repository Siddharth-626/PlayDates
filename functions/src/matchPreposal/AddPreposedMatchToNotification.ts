import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../utils/admin";

const db = admin.firestore();

export const AddProposedMatchToNotification = onDocumentCreated(
    {
        document: "matches/{matchId}",
        region: "asia-south1"
    },
    async (event) => {
        try {
            const {matchId} = event.params;
            const matchData = event.data?.data();
            if (!matchData) return;

            const players = matchData.players;

            for (const player of players) {
                const { userUid, profileId } = player;

                const matchProposal = {
                    type: "match proposal",
                    matchId:matchId,
                };

                await db
                    .collection(`users/${userUid}/profile/${profileId}/notifications`)
                    .add(matchProposal);

                console.log(`Added proposed match notification for Profile: ${profileId}`);
            }
        } catch (error) {
            console.error("Error while adding proposed match to notification:", error);
        }
    }
);
