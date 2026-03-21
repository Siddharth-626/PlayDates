import { db } from "@/services/config"
import { doc, updateDoc } from "firebase/firestore"

const ALLOWED_FIELDS = [
    "players", "status", "score", "isRead", "name", "photoUrl",
    "gender", "age", "skillLevel", "preference", "locations",
    "phoneNumber", "bio", "availability"
];

export const ChangeFieldInDb = async(field:string,value:any,path:string)=>{
    if (!ALLOWED_FIELDS.includes(field)) {
        console.error(`ChangeFieldInDb: field "${field}" is not allowed`);
        return;
    }
    if (!path || typeof path !== "string" || path.includes("..")) {
        console.error("ChangeFieldInDb: invalid path");
        return;
    }
    try{
        const docRef = doc(db,path);
        await updateDoc(docRef,{
            [field]:value
        })
    } catch(err){
        console.error("Error while changing field in db:", err);
    }
}
