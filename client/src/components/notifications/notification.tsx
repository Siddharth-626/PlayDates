import { respontToPlaymatesRequest } from "@/utils/Playmates/respondToPlaymatesRequest";
import PlaymateRequestNotification from "./NewPLaymateNotification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { useState } from "react";
import { MatchResultNotification } from "./matchNotifications/matchResultNotification";
import { Bell } from "lucide-react";

type NotificationTabProps = {
    notifications: any[] | undefined;
    setNotifications: (updated: any[]) => void;
};

export const NotificationTab = ({ notifications, setNotifications }: NotificationTabProps) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [NotificationRefresh, setNotificationRefersh] = useState(true);

    const handleMarkAllRead = () => {
        const updated = notifications?.map((n) => ({ ...n, isRead: true }));
        if (!updated) return;
        setNotifications(updated);
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
            console.log("err while managing the playmates request");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Bell className="text-green-600"/> Notifications
                </h2>
                <button
                    className="text-green-700 dark:text-green-400 hover:underline text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-2 py-1 transition"
                    onClick={handleMarkAllRead}
                >
                    Mark all as read
                </button>
            </div>
            <div className="space-y-4">
                {(!notifications || notifications.length === 0) ? (
                    <div className="flex flex-col items-center py-12 opacity-70">
                        <span className="text-5xl mb-2">🎉</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No notifications.</p>
                    </div>
                ) : (
                    notifications.map((note: any) => {
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
                                className={`transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                            >
                                <div className="animate-fade-in-down">{content}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
