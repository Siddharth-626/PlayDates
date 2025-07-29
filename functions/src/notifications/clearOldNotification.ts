import { onDocumentUpdated } from "firebase-functions/v2/firestore";

export const clearOldNotification = onDocumentUpdated(
    "users/{userUid}/profile/{profileId}/notifications/{notificationId}", async (event) => {
        const newNotification = event.data?.after.data();
        const oldNotification = event.data?.before.data();

        // Check if the notification is marked as read
        if (newNotification?.isRead && !oldNotification?.isRead) {
            // If the notification is read, delete it
            await event.data?.after.ref.delete();
            console.log(`Notification  for user  has been cleared.`);
        }
    })