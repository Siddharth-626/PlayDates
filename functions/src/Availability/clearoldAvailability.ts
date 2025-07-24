import { onSchedule } from "firebase-functions/v2/scheduler";
import { admin } from "../utils/admin";

export const clearOldAvailability = onSchedule(
    {
        schedule: "every 24 hours",
        timeZone: "Asia/Kolkata",
        region: "asia-south1",
    },
    async (event) => {
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

                const deletions = availabilitySnap.docs.map(async (doc) => {
                    const data = doc.data();
                    const dateValue = data.date?.toDate ? data.date.toDate() : null;
                    if (!dateValue) return;

                    const availabilityDate = new Date(
                        dateValue.getFullYear(),
                        dateValue.getMonth(),
                        dateValue.getDate()
                    );

                    if (availabilityDate < currentDate) {
                        await doc.ref.delete();
                    }
                });

                await Promise.all(deletions);
            }
        }

        console.log("✅ Old availability cleared");
        } catch (error) {
            console.log("error while clearing old avalability",error);
        }
    }
);
