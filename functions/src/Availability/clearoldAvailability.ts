import { onSchedule } from "firebase-functions/v2/scheduler";
import { admin } from "../utils/admin";
import { Timestamp } from "firebase-admin/firestore";

export const clearOldAvailability = onSchedule(
    {
        schedule: "every 24 hours",
        timeZone: "Asia/Kolkata",
        region: "asia-south1",
    },
    async () => {
        try {
            const db = admin.firestore();

            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const cutoff = Timestamp.fromDate(currentDate);

            // Use collection group query instead of scanning all users
            const expiredSnap = await db
                .collectionGroup("availability")
                .where("endDate", "<", cutoff)
                .get();

            let batch = db.batch();
            let count = 0;

            for (const doc of expiredSnap.docs) {
                batch.delete(doc.ref);
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

            console.log("Old availability cleared");
        } catch (error) {
            console.error("Error while clearing old availability:", error);
        }
    }
);
