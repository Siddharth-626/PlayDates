import { collectionGroup, getDocs } from "firebase/firestore";
import { PlayerProfile } from "../TYPE";
import { db } from "@/services/config";
import toast from "react-hot-toast";

export const FetchAllPlayers = async () => {

    try {
        const snapshot = await getDocs(collectionGroup(db, 'profile'));
        const allPlayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlayerProfile[];
        return allPlayers;
    } catch (error) {
        console.error("Error while fetching players:", error);
        toast.error("Error fetching players");
    }
}