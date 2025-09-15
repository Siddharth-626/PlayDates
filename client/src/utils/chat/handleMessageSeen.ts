import { db } from "@/services/config"
import { doc, updateDoc } from "firebase/firestore"


export const handleMessageSeen = async(chatId:string,msgId:string)=>{
    const messageRef = doc(db,"chats",chatId,"messages",msgId);

    await updateDoc(messageRef,{
        seen:true
    })
}