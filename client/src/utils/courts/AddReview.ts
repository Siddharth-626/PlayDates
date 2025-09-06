
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { reviewType } from "@/utils/TYPE";
import { db } from "@/services/config";

export const AddReviwetoCourt = async (courtId: string, review: reviewType) => {
    const courtRef = doc(db, "courts", courtId);
    const courtSnap = await getDoc(courtRef);

    if (!courtSnap.exists()) {
        throw new Error("Court not found");
    }

    await updateDoc(courtRef, {
        reviews: arrayUnion(review),
    });
};
