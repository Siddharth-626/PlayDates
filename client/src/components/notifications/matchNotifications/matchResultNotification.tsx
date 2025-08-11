import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { db } from "@/services/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

export const MatchResultNotification = ({ note }: { note: any }) => {
    const { message, type, isRead, status } = note;
    const {user} = useAuth();
    const {selectedProfile} = useProfile();

    if (type !== "match preposal result" || isRead) return null;


    const isSuccess = status === "accepted";

    useEffect(() => {
    if (!user?.uid || !selectedProfile?.id || !note?.id) return;

    const noteRef = doc(
        db,
        `users/${user.uid}/profile/${selectedProfile.id}/notifications/${note.id}`
    );

    updateDoc(noteRef,{
        isRead:true
    });
}, [user?.uid, selectedProfile?.id, note?.id]);

    return (
        <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl p-4 shadow-md animate-fade-in-down transition-all duration-300  mx-auto">
            <div className="text-green-600 dark:text-green-300">
                {isSuccess ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <div className="flex-1">
                <p className="text-lg md:text-xl font-semibold text-black dark:text-white">
                    {message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You’ve received a response to your match.
                </p>
            </div>
        </div>
    );
};
