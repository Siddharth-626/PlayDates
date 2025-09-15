import { db } from "@/services/config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export const listenToChats = (
    userUid: string | undefined,
    profileId: string | undefined,
    callback: (chat: any) => void
) => {
        if (!userUid || !profileId) return ()=> console.log("err");

        const q = query(
            collection(db, "chats"),
            where("participantsFinder", "array-contains", `${userUid}_${profileId}`),
            orderBy("updatedAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(chats);
        });
};
