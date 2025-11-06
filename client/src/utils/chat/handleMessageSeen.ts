import { db } from "@/services/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const handleMessageSeen = async(chatId:string,msgId:string)=>{
    const messageRef = doc(db,"chats",chatId,"messages",msgId);
    const messagesnap = await getDoc(messageRef);

    if(messagesnap.exists()){
         await updateDoc(messageRef,{
        seen:true
    })
    }
}