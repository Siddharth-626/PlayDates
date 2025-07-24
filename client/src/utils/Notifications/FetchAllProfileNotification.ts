
import { db } from "@/services/config";
import { collection, getDocs } from "firebase/firestore";
import { NotificationsType } from "../TYPE";




export const FetchAllProfileNotification = async ({userUid,profileId}:{userUid:string,profileId:string}): Promise<NotificationsType[]> => {

    const NotificationsRef = collection(db, `users/${userUid}/profile/${profileId}/notifications`);
    const NotificationSnap = await getDocs(NotificationsRef);

    const notifications: any[] = NotificationSnap.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            ...data
        };
    });
    return notifications;

}