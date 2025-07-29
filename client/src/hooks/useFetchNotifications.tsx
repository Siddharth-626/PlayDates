import { FetchAllProfileNotification } from "@/utils/Notifications/FetchAllProfileNotification";
import { useEffect, useState } from "react"


export const useFetchNotifications = ({ userUid, profileId }: { userUid: string | undefined, profileId: string | undefined }) => {

    const [notifications, setNotifications] = useState<any[]>();

    const fetchNotifications = async () => {
        if (userUid! && profileId) {
            const data = await FetchAllProfileNotification({
                userUid: userUid,
                profileId: profileId
            });
            setNotifications(data);
        }
    }
    useEffect(() => {
        fetchNotifications()
    }, [userUid, profileId])

    return { notifications, setNotifications };
}