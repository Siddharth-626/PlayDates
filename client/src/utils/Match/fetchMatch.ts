import { db } from "@/services/config";
import { doc, getDoc } from "firebase/firestore";


export const fetchMatch = async (matchId: string) => {
    try {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);

        const MatchData = matchSnap?.data();

        if (!MatchData) return;

        return {
            ...MatchData
        }
    } catch (error) {
        console.log("err while fetching match", error);
    }
}