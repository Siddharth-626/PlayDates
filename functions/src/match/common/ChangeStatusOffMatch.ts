import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

const SendStatus = async (status: string, matchId: string, players: any[],MatchData:any) => {
    for (const player of players) {
        const notification = {
            type: "match preposal result",
            message: `The Match at ${MatchData.startTime} is ${status} `,
            idRead: false
        }
        await db.collection(`users/${player.userUid}/profile/${player.profileId}/notifications`).add(notification);
    }
    await db.doc(`matches/${matchId}`).update({
        status: status
    })
    console.log(`chandged match status to ${status}`);
}


export const changeStatusOfMatch = onDocumentUpdated({
    document: "matches/{matchId}",
    region: "asia-south1"
}, async (event) => {
    try {
        const { matchId } = event.params;

        const MatchData = event.data?.after.data();

        if (!MatchData) return;

        const players = MatchData.players;

        const isValid = players.every((player: any) =>
            player.status === "accepted"
        )
        const isRejection = players.some((player: any) =>
            player.status == "rejected"
        )

        if (isValid && MatchData.status != "accepted" ) {
            await SendStatus("accepted", matchId, players,MatchData);
        }
        if (isRejection) {
            await SendStatus("proposed", matchId, players,MatchData);
        }
    } catch (error) {
        console.log("Error while handling match status change", error);
    }
})