import { onSchedule } from "firebase-functions/v2/scheduler";
import { admin } from "../../utils/admin";


export const clearOldMatchPreposal = onSchedule(
    { timeZone: "Asia/Kolkata", schedule: "every 24 hours", region: "asia-south1" },
    async (event) => {
        try {
            const db = admin.firestore();
            const matchSnap = await db.collection("matches").get();

            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            for (const matchDoc of matchSnap.docs) {
                const matchId = matchDoc.id;
                const matchData = matchDoc.data();

                if (!matchData.date) continue;

                const matchDate = matchData.date.toDate ? matchData.date.toDate() : null;
                if (!matchDate) continue;

                const availabilityDate = new Date(
                    matchDate.getFullYear(),
                    matchDate.getMonth(),
                    matchDate.getDate()
                );

                if (availabilityDate < currentDate) {
                    await db.doc(`matches/${matchId}`).delete();
                    console.log(`Match with ID ${matchId} has been cleared.`);
                }
            }
        } catch (error) {
            console.error("Error while clearing old matches:", error);
        }
    })