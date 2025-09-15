import { db } from "@/services/config";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

export const createChat = async (
    userUid: string | undefined,
    profileId: string | undefined,
    playmateUid: string | undefined,
    playmateProfileId: string | undefined
) => {
    if (!userUid || !profileId || !playmateUid || !playmateProfileId) {
        console.error("createChat: missing required fields", { userUid, profileId, playmateUid, playmateProfileId });
        return;
    }
    const chatId =
        userUid < playmateUid
            ? `${userUid}_${profileId}__${playmateUid}_${playmateProfileId}`
            : `${playmateUid}_${playmateProfileId}__${userUid}_${profileId}`;

    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
        await setDoc(chatRef, {
            participants: [
                { userUid, profileId },
                { userUid: playmateUid, profileId: playmateProfileId },
            ],
            participantsFinder: [`${userUid}_${profileId}`, `${playmateUid}_${playmateProfileId}`],
            lastMessage: null,
            updatedAt: serverTimestamp(),
        });
    }

    return chatId;
};
