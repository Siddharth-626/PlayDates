import { db } from "@/services/config"
import { doc, updateDoc } from "firebase/firestore"


export const handleScoreSubmit = async (Score: any, matchId: string) => {

    if (!matchId || typeof matchId !== "string") {
        throw new Error("Invalid matchId");
    }
    if (!Score || typeof Score !== "object") {
        throw new Error("Invalid score data");
    }

    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, {
        score: Score,
    })
}
