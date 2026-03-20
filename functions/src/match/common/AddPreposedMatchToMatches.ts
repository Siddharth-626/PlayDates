import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";
import { createChat } from "../../utils/CreateChat";


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

            await createChat(players, matchId);

            for (const player of players) {
                const { userUid, profileId } = player;

                const matchProposal = {
                    type: type,
                    matchId:matchId,
                    isRead:false,
                    status:"pending"
                };

                await db
                    .doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`)
                    .set(matchProposal);
                console.log(`Added proposed match for Profile: ${profileId}`);
            }
        } catch (error) {
            console.error("Error while adding proposed match:", error);
        }
    }
);
