import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";
import { createChat } from "../../utils/CreateChat";
import { buildProfileMatchDoc } from "../../utils/matchTypes";


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

            const players = matchData.players;
            if (!Array.isArray(players) || players.length === 0) return;

            await createChat(players, matchId);

            const batch = db.batch();
            for (const player of players) {
                const { userUid, profileId } = player;
                const ref = db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`);
                batch.set(ref, buildProfileMatchDoc(matchId, matchData, "pending"));
            }
            await batch.commit();
            console.log(`AddProposedMatchToProfile: created profile matches for ${players.length} players in match ${matchId}`);
        } catch (error) {
            console.error("Error while adding proposed match:", error);
        }
    }
);
