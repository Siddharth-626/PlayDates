import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();
const Change = async (BeforeMatchData: any, AfterMatchData: any, status: string, matchId: string) => {

    if (!BeforeMatchData || !AfterMatchData) return
    if (BeforeMatchData.status != status && AfterMatchData.status == status) {
        const players = AfterMatchData.players;

        const batch = db.batch();
        for (const player of players) {
            const { userUid, profileId } = player;
            const ref = db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`);
            batch.update(ref, { status: status });
        }
        await batch.commit();
    }
}
export const ChangeStatusOffProfileMatches = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1",
}, async (event) => {
    try {
        const BeforeMatchData = event.data?.before.data();
        const AfterMatchData = event.data?.after.data();
        const matchId = event.params.matchId;

        await Change(BeforeMatchData, AfterMatchData, AfterMatchData?.status, matchId);
    } catch (error) {
        console.error("ChangeStatusOffProfileMatches: error:", error);
    }
})