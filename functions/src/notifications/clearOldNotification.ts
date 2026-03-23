import { onDocumentUpdated } from "firebase-functions/v2/firestore";

export const clearOldNotification = onDocumentUpdated(
    {
        document: "users/{userUid}/profile/{profileId}/notifications/{notificationId}",
        region: "asia-south1",
    }, async (event) => {
        try {
            const newNotification = event.data?.after.data();
            const oldNotification = event.data?.before.data();

            // When a notification is marked as read, add a readAt timestamp
            if (newNotification?.isRead && !oldNotification?.isRead) {
                await event.data?.after.ref.update({
                    readAt: new Date(),
                });
                console.log(`clearOldNotification: notification marked as read`);
            }
        } catch (error) {
            console.error("clearOldNotification: error updating notification:", error);
        }
    })
