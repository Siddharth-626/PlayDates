import { isMatchResultNotification } from "@/utils/Match/matchTypes";
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
        } else if (isMatchResultNotification(note.type)) {
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
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-green)15' }}>
                        <Bell className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <div>
                        <h2 className="font-outfit text-xl font-bold" style={{ color: 'var(--content-primary)' }}>
                            Notifications
                            {unreadNotifications.length > 0 && (
                                <span
                                    className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full animate-notif-pulse"
                                    style={{ background: 'var(--accent-green)', color: '#fff' }}
                                >
                                    {unreadNotifications.length}
                                </span>
                            )}
                        </h2>
                        <p className="text-xs" style={{ color: 'var(--content-muted)' }}>
                            {unreadNotifications.length > 0
                                ? `${unreadNotifications.length} unread`
                                : 'All caught up'}
                        </p>
                    </div>
                </div>
                {/* item 31: only show when there are unread notifications */}
                {unreadNotifications.length > 0 && (
                    <button
                        className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                        style={{ color: 'var(--accent-green)', background: 'var(--accent-green)15' }}
                        onClick={handleMarkAllRead}
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Unread / New */}
            <div className="space-y-3">
                {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-float"
                            style={{ background: 'var(--surface-overlay)' }}
                        >
                            <Bell className="w-7 h-7" style={{ color: 'var(--content-muted)' }} />
                        </div>
                        <p className="font-semibold" style={{ color: 'var(--content-secondary)' }}>No notifications</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--content-muted)' }}>You&apos;re all caught up!</p>
                    </div>
                ) : (
                    <>
                        {unreadNotifications.length === 0 ? (
                            <p className="text-sm text-center py-3" style={{ color: 'var(--content-muted)' }}>No new notifications</p>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--content-muted)' }}>New</p>
                                {unreadNotifications.map((note) => (
                                    <div
                                        key={note.id}
                                        className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                                        style={{ borderLeft: '3px solid var(--accent-green)' }}
                                    >
                                        {renderNotification(note)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Read / Earlier */}
            {readNotifications.length > 0 && (
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <button
                        onClick={() => setShowOldNotifications(!showOldNotifications)}
                        className="flex items-center gap-2 text-sm font-semibold w-full transition-colors mb-3"
                        style={{ color: 'var(--content-muted)' }}
                    >
                        {showOldNotifications ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        Earlier ({readNotifications.length})
                    </button>
                    {showOldNotifications && (
                        <div className="space-y-2">
                            {readNotifications.map(renderNotification)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
