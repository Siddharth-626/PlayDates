import { db } from "@/services/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";


export const fetchMatch = (matchId: string,callback:(match:any)=>void) => {
        const matchRef = doc(db, "matches", matchId);
        return onSnapshot(matchRef,(doc)=>{
            const match= {
                id:doc.id,
                ...doc.data()
            }
            callback(match)
        })
}