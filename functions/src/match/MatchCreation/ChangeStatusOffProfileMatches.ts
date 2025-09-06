import { onDocumentUpdated } from "firebase-functions/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();
const Change = async (BeforeMatchData: any, AfterMatchData: any, status: string, matchId: string) => {

    if (!BeforeMatchData || !AfterMatchData) return
    if (BeforeMatchData.status != status && AfterMatchData.status == status) {
        const players = AfterMatchData.players;
        const Players = [];

        for (const player of players) {
            const { userUid, profileId } = player;

            const playerMatchSnap = await db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`).get();
            playerMatchSnap.ref.update({ status: status });
            Players.push({ userUid, profileId, status: status });
        }

        await db.doc(`matches/${matchId}`).update({
            players: Players
        })
    }
}
export const ChangeStatusOffProfileMatches = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1",
}, async (event) => {

    const BeforeMatchData = event.data?.before.data();
    const AfterMatchData = event.data?.after.data();
    const matchId = event.params.matchId;

    Change(BeforeMatchData, AfterMatchData, AfterMatchData?.status, matchId);
})