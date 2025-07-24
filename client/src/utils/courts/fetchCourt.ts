import { db } from "@/services/config";
import { doc, getDoc } from "firebase/firestore";


export const fetchCourt = async (courtId: string) => {
    try {
        const courtRef = doc(db, "courts", courtId);
        const courtSnap = await getDoc(courtRef);

        if (!courtSnap) return
        const courtData = courtSnap.data();

        if (!courtData) return;
        return {
            ...courtData
        }
    } catch (error) {
        console.log("err while fetching court", error);
    }
}