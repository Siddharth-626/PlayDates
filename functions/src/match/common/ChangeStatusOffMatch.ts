import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

const SendNotifications = async (status: string, matchId: string, players: any[], MatchData: any) => {
    const startTimeDisplay = MatchData.startTime?.toDate
        ? MatchData.startTime.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : MatchData.startTime || "TBD";

    const batch = db.batch();
    for (const player of players) {
        const notification = {
            type: "match_result",
            matchId: matchId,
            message: `The Match at ${startTimeDisplay} is ${status}`,
            isRead: false,
            status: status,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const notifRef = db.collection(`users/${player.userUid}/profile/${player.profileId}/notifications`).doc();
        batch.set(notifRef, notification);
    }
    await batch.commit();
    console.log(`changeStatusOfMatch: sent ${status} notifications for match ${matchId} to ${players.length} players`);
};


export const changeStatusOfMatch = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1"
}, async (event) => {
    try {
        const { matchId } = event.params;

        const afterData = event.data?.after.data();
        const beforeData = event.data?.before.data();

        if (!afterData || !beforeData) return;

        const players = afterData.players;

        // Only send notifications when the match status actually changes
        // (the client sets the status in a transaction, so we react to the status change)
        if (beforeData.status === afterData.status) return;

        const newStatus = afterData.status;

        // Send notifications for meaningful status transitions
        if (newStatus === "accepted" || newStatus === "rejected") {
            await SendNotifications(newStatus, matchId, players, afterData);
        }

        console.log(`changeStatusOfMatch: match ${matchId} status changed from ${beforeData.status} to ${newStatus}`);
    } catch (error) {
        console.error("changeStatusOfMatch: error handling match status change:", error);
    }
})