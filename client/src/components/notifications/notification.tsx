
import { respontToPlaymatesRequest } from "@/utils/Playmates/respondToPlaymatesRequest";
import PlaymateRequestNotification from "./NewPLaymateNotification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { NotificationsType } from "@/utils/Notifications/FetchAllProfileNotification";
import { useState } from "react";
export const NotificationTab = ({ notifications, setNotifications }: any) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [NotificationRefresh, setNotificationRefersh] = useState(true);
    const handleMarkAllRead = () => {
        const updated = notifications.map((n) => ({ ...n, isRead: true }));
        setNotifications(updated);
    };
    const handlePlaymateResponse = (accepted: boolean, note: NotificationsType) => {
        try {
            if (!user?.uid || !selectedProfile?.id) return;
            if (accepted) {
                respontToPlaymatesRequest({
                    currentUserUid: user?.uid,
                    currentUserProfileId: selectedProfile?.id,
                    fromUserUid: note.fromUserUid,
                    fromUserProfileId: note.fromProfileId,
                    notifiId: note.id,
                    accepted: true
                })
            }
            if (!accepted) {
                respontToPlaymatesRequest({
                    currentUserUid: user?.uid,
                    currentUserProfileId: selectedProfile?.id,
                    fromUserUid: note.fromUserUid,
                    fromUserProfileId: note.fromProfileId,
                    notifiId: note.id,
                    accepted: false
                })
            }
            setNotificationRefersh(NotificationRefresh ? false : true);
        } catch (error) {
            console.log("err while mannaging the playmates request");
        }
    }
    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Notifications</h2>
                <button
                    className="text-green-600 hover:underline text-sm"
                    onClick={handleMarkAllRead}
                >
                    Mark all as read
                </button>
            </div>
            <div className="space-y-2">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications.</p>
                ) : (
                    notifications.map((note: any) => (
                        <div
                            key={note.id}
                            className={`p-4 rounded-lg transition-all duration-300 border`}
                        >
                            <PlaymateRequestNotification note={note} onRespond={handlePlaymateResponse} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
