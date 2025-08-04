import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../utils/admin";

const db = admin.firestore();

export const AddProposedMatchToProfile = onDocumentCreated(
    {
        document: "matches/{matchId}",
        region: "asia-south1"
    },
    async (event) => {
        try {
            const {matchId} = event.params;
            const matchData = event.data?.data();
            
            if (!matchData) return;
            const type = matchData.status == "proposed" ? "match proposal" : "created match"

            const players = matchData.players;

            for (const player of players) {
                const { userUid, profileId } = player;

                const matchProposal = {
                    type: type,
                    matchId:matchId,
                    isRead:false,
                    status:"pending"
                };

                await db
                    .collection(`users/${userUid}/profile/${profileId}/matches`)
                    .add(matchProposal);

                console.log(`Added proposed match for Profile: ${profileId}`);
            }
        } catch (error) {
            console.error("Error while adding proposed match:", error);
        }
    }
);
