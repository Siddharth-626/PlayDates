import { db } from "@/services/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const updateChat = async(chatId:string,chatData:any)=>{

    const chatRef = doc(db,"chats",chatId);
    const chatSnap = await getDoc(chatRef);

    if(chatSnap.exists()){
        await updateDoc(chatRef,chatData);
    }
}