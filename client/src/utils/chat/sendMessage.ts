import { db } from "@/services/config"
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"


export const sendMessage = async (chatId: string, message: string, senderUid: string, senderProfileId: string, name: string, photoUrl: string) => {

    if (!message || !message.trim()) return;
    if (message.length > 5000) {
        throw new Error("Message exceeds maximum length of 5000 characters");
    }
    if (!chatId || !senderUid) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef);
    const data = {
        senderUid,
        senderProfileId,
        senderName: name,
        senderPhotoUrl: photoUrl,
        text: message,
        createdAt: serverTimestamp(),
        seen: false
    }
    await addDoc(messagesRef, data)
    if (chatSnap.exists()) {
        await updateDoc(chatRef, {
            lastMessage: data,
            updatedAt: serverTimestamp()
        })
    }
}