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
            const userSnap = await db.collection("users").get();

            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            for (const userDoc of userSnap.docs) {
                const userUid = userDoc.id;
                const profileSnap = await db.collection(`users/${userUid}/profile`).get();

                for (const profileDoc of profileSnap.docs) {
                    const profileId = profileDoc.id;
                    const availabilitySnap = await db
                        .collection(`users/${userUid}/profile/${profileId}/availability`)
                        .get();

                    for (const doc of availabilitySnap.docs) {
                        const data = doc.data();
                        const dateValue =
                            data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate;

                        if (!dateValue) continue;

                        const availabilityDate = new Date(dateValue);

                        if (availabilityDate < currentDate) {
                            await doc.ref.delete();
                        }
                    }
                }
            }

            console.log("✅ Old availability cleared");
        } catch (error) {
            console.error("❌ Error while clearing old availability:", error);
        }
    }
);
