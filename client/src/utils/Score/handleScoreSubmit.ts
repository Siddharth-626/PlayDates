import { db } from "@/services/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const handleScoreSubmit = async (Score: any, matchId: string) => {

    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, {
        score: Score,
    })
}
