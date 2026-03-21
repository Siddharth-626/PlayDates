import { db } from "@/services/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const ALLOWED_CHAT_FIELDS = ["groupName", "lastMessage", "updatedAt", "participants", "participantsFinder", "participantUids"];

export const updateChat = async(chatId:string,chatData:any)=>{
    if (!chatId || typeof chatId !== "string") return;

    // Only allow known fields
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(chatData)) {
        if (ALLOWED_CHAT_FIELDS.includes(key)) {
            sanitized[key] = chatData[key];
        }
    }
    if (Object.keys(sanitized).length === 0) return;

    const chatRef = doc(db,"chats",chatId);
    const chatSnap = await getDoc(chatRef);

    if(chatSnap.exists()){
        await updateDoc(chatRef,sanitized);
    }
}