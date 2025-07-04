
import { db } from "@/services/config";
import { collection, getDocs } from "firebase/firestore";


 export type NotificationsType = {
    id: string,
    type: string,
    fromUserUid: string;
    fromProfileId: string;
    message: string,
    isRead: boolean,
    status: string,
}

export const FetchAllProfileNotification = async ({userUid,profileId}:{userUid:string,profileId:string}): Promise<NotificationsType[]> => {

    const NotificationsRef = collection(db, `users/${userUid}/profile/${profileId}/notifications`);
    const NotificationSnap = await getDocs(NotificationsRef);

    const notifications: NotificationsType[] = NotificationSnap.docs.map((doc) => {
        const data = doc.data();

        return {
            id: data.id || doc.id, // fallback if `id` isn't in the document
            type: data.type || "",
            fromUserUid: data.fromUserUid || "",
            fromProfileId: data.fromProfileId || "",
            message: data.message || "",
            isRead: data.isRead ?? false,
            status: data.status || "pending",
        };
    });
    return notifications;

}