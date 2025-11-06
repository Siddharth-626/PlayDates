import { db } from "@/services/config";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

export const createChat = async (
    players: any[],
    type: string,
    matchId: string,
    groupName: string
) => {
    if (!players || players.length < 2) {
        console.error("createChat: need at least 2 players", { players });
        return;
    }

    const playerKeys = players.map((p) => (
        `${p.userUid}_${p.profileId}`
    ));

    const sortedKeys = [...playerKeys].sort();

    const chatId =
        sortedKeys.join("__");


    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
        await setDoc(chatRef, {
            type:type,
            groupName:groupName,
            participants: players,
            participantsFinder: playerKeys,
            lastMessage: null,
            updatedAt: serverTimestamp(),
            matchId
        });
    }

    return chatId;
};
