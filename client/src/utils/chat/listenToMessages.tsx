import { db } from "@/services/config"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"


export const listenToMessages = (chatId:string,callback:(message:any)=>void)=>{
    const q = query(
        collection(db,"chats",chatId,"messages"),
        orderBy("createdAt","asc")
    )

    return onSnapshot(q,(snapshot)=>{
        const messages = snapshot.docs.map((doc)=>{
            const data = doc.data();
            return{
                id:doc.id,
                ...data
            }
        })
        callback(messages);
    })
}