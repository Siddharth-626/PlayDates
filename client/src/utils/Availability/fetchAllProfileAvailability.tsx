import { db } from "@/services/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { AvailabilityType } from "../TYPE";


export const fetchAllProfileAvailability = async (userUid: string | undefined, profileId: string | undefined): Promise<AvailabilityType[] | undefined> => {
    if (!userUid || !profileId) return
    try {
        const AvailabilityRef = collection(db, `users/${userUid}/profile/${profileId}/availability`)
        const AvailabilitySnap = await getDocs(AvailabilityRef);

        const Availability: AvailabilityType[] = AvailabilitySnap.docs.map((doc) => {
            const data = doc.data();
            const dateValue = (data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date)) as Date;

            return {
                id: doc.id,
                date: dateValue,
                time: data.time,
                duration: data.duration,
                locations: data.locations,
                preference: data.preference
            }
        })
        return Availability;
    } catch (error) {
        console.log("err while fetching all availability");
    }
}