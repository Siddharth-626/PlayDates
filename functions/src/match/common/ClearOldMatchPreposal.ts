import { onSchedule } from "firebase-functions/v2/scheduler";
import { admin } from "../../utils/admin";
import { Timestamp } from "firebase-admin/firestore";


export const clearOldMatchPreposal = onSchedule(
    { timeZone: "Asia/Kolkata", schedule: "every 24 hours", region: "asia-south1" },
    async (event) => {
        try {
            const db = admin.firestore();

            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const cutoff = Timestamp.fromDate(currentDate);

            // Query only old matches instead of scanning entire collection
            const matchSnap = await db
                .collection("matches")
                .where("date", "<", cutoff)
                .get();

            let batch = db.batch();
            let count = 0;

            for (const matchDoc of matchSnap.docs) {
                const matchData = matchDoc.data();
                if (matchData.status === "accepted") continue;

                batch.delete(matchDoc.ref);
                count++;

                // Firestore batch limit is 500 — commit and create new batch
                if (count === 500) {
                    await batch.commit();
                    batch = db.batch();
                    count = 0;
                }
            }

            if (count > 0) {
                await batch.commit();
            }

            console.log(`clearOldMatchPreposal: cleared old match proposals (cutoff: ${currentDate.toISOString()})`);
        } catch (error) {
            console.error("clearOldMatchPreposal: error while clearing old matches:", error);
        }
    })