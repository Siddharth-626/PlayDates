import { db } from "@/services/config"
import { doc, setDoc } from "firebase/firestore"
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export const createMatch = async () => {
    try {
        const matchId = uuidv4();
        const matchRef = doc(db, "matches", matchId);

        await setDoc(matchRef, {
            players: ["uid_123", "uid_456"],
            courtId: "court_abc123",
            date: "2025-06-26",
            timeSlot: "08:00-09:00",
            isConfirmed: true,
            type: "singles", // or "doubles"
            createdAt: new Date().toISOString(),
            status: "scheduled" // or "completed", "cancelled"
        }

        )
        toast.success("Match added");

    } catch (err) {
        console.log(err);
        toast.error('err while creating match')
    }
}