import { db } from "@/services/config"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"


export const sendMessage = async(chatId:string,message:string,senderUid:string,senderProfileId:string) =>{

    const messagesRef = collection(db,"chats",chatId,"messages");
    const chatRef = doc(db,"chats",chatId)

    const data = {
        senderUid,
        senderProfileId,
        text:message,
        createdAt:serverTimestamp(),
        seen:false
    }
    await addDoc(messagesRef,data)

    await updateDoc(chatRef,{
        lastMessage:data,
        updatedAt:serverTimestamp()
    })

}