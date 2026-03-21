import { db } from "@/services/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react"


export const useFetchNotifications = ({ userUid, profileId }: { userUid: string | undefined, profileId: string | undefined }) => {

    const [notifications, setNotifications] = useState<any[]>();

    useEffect(() => {
        if (!userUid || !profileId) return;

        const notificationsRef = collection(db, `users/${userUid}/profile/${profileId}/notifications`);
        const unsubscribe = onSnapshot(notificationsRef, (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setNotifications(data);
        });

        return () => unsubscribe();
    }, [userUid, profileId])

    return { notifications, setNotifications };
}
