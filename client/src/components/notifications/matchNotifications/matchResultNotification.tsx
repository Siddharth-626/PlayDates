import { isMatchResultNotification } from "@/utils/Match/matchTypes";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { db } from "@/services/config";
import { doc, updateDoc } from "firebase/firestore";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

export const MatchResultNotification = ({ note }: { note: any }) => {
    const { message, type, isRead, status } = note;
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    useEffect(() => {
        if (!user?.uid || !selectedProfile?.id || !note?.id || isRead) return;

        const noteRef = doc(
            db,
            `users/${user.uid}/profile/${selectedProfile.id}/notifications/${note.id}`
        );

        updateDoc(noteRef, { isRead: true }).catch(() => {});
    }, [user?.uid, selectedProfile?.id, note?.id, isRead]);

    if (!isMatchResultNotification(type)) return null;

    const isSuccess = status === "accepted";

    return (
        <div className={`flex items-center gap-4 border rounded-xl p-4 shadow-md animate-fade-in-down transition-all duration-300 mx-auto ${
            isRead
                ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
                : "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700"
        }`}>
            <div className={isRead ? "text-gray-400 dark:text-gray-500" : "text-green-600 dark:text-green-300"}>
                {isSuccess ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div className="flex-1">
                <p className={`text-lg md:text-xl font-semibold ${
                    isRead ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                }`}>
                    {message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You've received a response to your match.
                </p>
            </div>
            {isRead && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Read</span>
            )}
        </div>
    );
};
