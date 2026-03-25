import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

export const ChangeStatusOffProfileMatches = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1",
}, async (event) => {
    try {
        const beforeData = event.data?.before.data();
        const afterData = event.data?.after.data();
        const matchId = event.params.matchId;

        if (!beforeData || !afterData) return;
        if (beforeData.status === afterData.status) return; // no status change

        const players = afterData.players;
        if (!Array.isArray(players) || players.length === 0) return;

        const newStatus = afterData.status;

        const batch = db.batch();
        for (const player of players) {
            const { userUid, profileId } = player;
            const ref = db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`);
            const update: Record<string, any> = {
                status: newStatus,
                matchStatus: newStatus,
            };
            // Also sync time/date fields when they change (e.g. time_proposed)
            if (afterData.startTime !== undefined) update.startTime = afterData.startTime;
            if (afterData.endTime !== undefined) update.endTime = afterData.endTime;
            if (afterData.date !== undefined) update.date = afterData.date;
            batch.update(ref, update);
        }
        await batch.commit();
        console.log(`ChangeStatusOffProfileMatches: synced status "${newStatus}" to ${players.length} profile matches for match ${matchId}`);
    } catch (error) {
        console.error("ChangeStatusOffProfileMatches: error:", error);
    }
})