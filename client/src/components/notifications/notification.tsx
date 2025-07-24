
import { respontToPlaymatesRequest } from "@/utils/Playmates/respondToPlaymatesRequest";
import PlaymateRequestNotification from "./NewPLaymateNotification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { MatchPreposalNotificationType, NotificationsType } from "@/utils/TYPE";
import { useState } from "react";
import toast from "react-hot-toast";
import { MatchPreposalNotification } from "./MatchPreposalNoptification";
import { respondToMatchPreposal } from "@/utils/MatchPreposal/respondToMAtchPreposal";

type NotificationTabProps = {
    notifications: NotificationsType[] | MatchPreposalNotificationType[];
    setNotifications: (updated: NotificationsType[]) => void;
};
export const NotificationTab = ({ notifications, setNotifications }: NotificationTabProps) => {
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
            setNotificationRefersh(!NotificationRefresh);
        } catch (error) {
            console.log("err while mannaging the playmates request");
        }
    }

    const handleMatchPreposalResponse = async (status: string, matchId: string) => {
        if (!user?.uid || !selectedProfile?.id || !matchId) return;

        await respondToMatchPreposal({
            matchId,
            userUid: user.uid,
            profileId: selectedProfile.id,
            status,
        });

        toast.success("You accepted the Match Proposal");
    };
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
                            className={`p-4 rounded-lg transition-all duration-300`}
                        >
                            {note.type == "playmates request" ? <PlaymateRequestNotification note={note} onRespond={handlePlaymateResponse} /> : <></>}
                            <MatchPreposalNotification note={note} onRespond={handleMatchPreposalResponse} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
