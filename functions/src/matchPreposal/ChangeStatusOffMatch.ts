import { onDocumentUpdated } from "firebase-functions/firestore";
import { admin } from "../utils/admin";

const db = admin.firestore();

export const changeStatusOfMatch = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1"
}, async (event) => {
    try {
        const { matchId } = event.params;

        const MatchSnap = await db.doc(`matches/${matchId}`).get();
        const MatchData = MatchSnap?.data();

        if (!MatchData) return;

        const players = MatchData.players;

        const isValid = players.every((player: any) =>
            player.status === "accepted"
        )

        if (isValid) {
            await db.doc(`matches/${matchId}`).update({
                status: "accepted"
            })
            console.log("chandged match status to accepted");
        }

    } catch (error) {
        console.log("error while handleing match status change", error);
    }
})