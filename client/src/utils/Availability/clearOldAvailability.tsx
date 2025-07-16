import { db } from "@/services/config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

export const clearOldAvalability = async (userUid: string, profileId: string) => {
    if (!userUid || !profileId) return;
    try {
        const now = new Date();
        const currentDate = new Date(now.getFullYear(),now.getMonth(),now.getDate());
        const AvailabilityRef = collection(db, `users/${userUid}/profile/${profileId}/availability`);
        const AvailabilitySnap = await getDocs(AvailabilityRef);

        const deletions = AvailabilitySnap.docs.map(async (docSnap) => {
            const data = docSnap.data();
            if (!data.date || typeof data.date.toDate !== 'function') return;

            const availabilityDate = data.date.toDate();
            const availabilityDateOnly = new Date(
                availabilityDate.getFullYear(),
                availabilityDate.getMonth(),
                availabilityDate.getDate()
            )

            if (availabilityDateOnly < currentDate) {
                const docRef = doc(db, `users/${userUid}/profile/${profileId}/availability`, docSnap.id);
                await deleteDoc(docRef);
            }
        });

        await Promise.all(deletions);
    } catch (error) {
        console.error("Error while clearing old availability:", error);
    }
};
