import { onDocumentUpdated } from "firebase-functions/v2/firestore";

export const clearOldNotification = onDocumentUpdated(
    "users/{userUid}/profile/{profileId}/notifications/{notificationId}", async (event) => {
        const newNotification = event.data?.after.data();
        const oldNotification = event.data?.before.data();

        // When a notification is marked as read, add a readAt timestamp
        // but do NOT delete it — keep it for the user to review later
        if (newNotification?.isRead && !oldNotification?.isRead) {
            await event.data?.after.ref.update({
                readAt: new Date(),
            });
            console.log(`Notification marked as read for user.`);
        }
    })
