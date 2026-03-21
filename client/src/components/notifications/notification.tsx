import { respontToPlaymatesRequest } from "@/utils/Playmates/respondToPlaymatesRequest";
import PlaymateRequestNotification from "./NewPLaymateNotification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { useState } from "react";
import { MatchResultNotification } from "./matchNotifications/matchResultNotification";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/services/config";
import { doc, writeBatch } from "firebase/firestore";

type NotificationTabProps = {
    notifications: any[] | undefined;
    setNotifications: (updated: any[]) => void;
};

export const NotificationTab = ({ notifications, setNotifications }: NotificationTabProps) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [NotificationRefresh, setNotificationRefersh] = useState(true);
    const [showOldNotifications, setShowOldNotifications] = useState(false);

    const handleMarkAllRead = async () => {
        if (!notifications || !user?.uid || !selectedProfile?.id) return;
        const unread = notifications.filter((n) => !n.isRead);
        if (unread.length === 0) return;
        const batch = writeBatch(db);
        unread.forEach((n) => {
            const ref = doc(db, `users/${user.uid}/profile/${selectedProfile.id}/notifications/${n.id}`);
            batch.update(ref, { isRead: true });
        });
        await batch.commit();
    };

    const handlePlaymateResponse = (accepted: boolean, note: any) => {
        try {
            if (!user?.uid || !selectedProfile?.id) return;
            respontToPlaymatesRequest({
                currentUserUid: user?.uid,
                currentUserProfileId: selectedProfile?.id,
                fromUserUid: note.fromUserUid,
                fromUserProfileId: note.fromProfileId,
                notifiId: note.id,
                accepted
            });
            setNotificationRefersh(!NotificationRefresh);
        } catch (error) {
            // silently fail
        }
    };

    // Split notifications into unread (new) and read (old)
    const unreadNotifications = notifications?.filter((n) => !n.isRead) || [];
    const readNotifications = notifications?.filter((n) => n.isRead) || [];

    const renderNotification = (note: any) => {
        let content = null;
        if (note.type === "playmates request") {
            content = (
                <PlaymateRequestNotification
                    note={note}
                    onRespond={handlePlaymateResponse}
                />
            );
        } else if (note.type === "match preposal result") {
            content = <MatchResultNotification note={note} />;
        }
        if (!content) return null;
        return (
            <div
                key={note.id}
                className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
                <div className="animate-fade-in-down">{content}</div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Bell className="text-green-600"/> Notifications
                    {unreadNotifications.length > 0 && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadNotifications.length}
                        </span>
                    )}
                </h2>
                <button
                    className="text-green-700 dark:text-green-400 hover:underline text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-2 py-1 transition"
                    onClick={handleMarkAllRead}
                >
                    Mark all as read
                </button>
            </div>

            {/* New (Unread) Notifications */}
            <div className="space-y-4">
                {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                    <div className="flex flex-col items-center py-12 opacity-70">
                        <span className="text-5xl mb-2">🎉</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No notifications.</p>
                    </div>
                ) : (
                    <>
                        {unreadNotifications.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No new notifications</p>
                        ) : (
                            unreadNotifications.map(renderNotification)
                        )}
                    </>
                )}
            </div>

            {/* Old (Read) Notifications - Collapsible */}
            {readNotifications.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button
                        onClick={() => setShowOldNotifications(!showOldNotifications)}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-semibold transition w-full"
                    >
                        {showOldNotifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        Previous Notifications ({readNotifications.length})
                    </button>
                    {showOldNotifications && (
                        <div className="space-y-3 mt-3">
                            {readNotifications.map(renderNotification)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
