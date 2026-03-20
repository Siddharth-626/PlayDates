import { db } from "@/services/config"
import { doc, updateDoc } from "firebase/firestore"


export const ChangeFieldInDb = async(field:string,value:any,path:string)=>{
    try{
        const docRef = doc(db,path);
        await updateDoc(docRef,{
            players:value
        })
    } catch(err){
        // silently fail — caller handles UI feedback
    }
}
