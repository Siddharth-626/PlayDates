import { db } from "@/services/config";
import { doc, getDoc } from "firebase/firestore";
import { courtType } from "../TYPE";
import { fetchAllCourts } from "./fetchAllCourts";


export const fetchSelectedCourt = async (
    userUid: string,
    profileId: string,
): Promise<courtType | undefined> => {

    const courts = await fetchAllCourts();

    if (!userUid || !profileId || !courts) return;

    try {
        const profileRef = doc(db, "users", userUid, "profile", profileId);
        const profileSnap = await getDoc(profileRef);

        const profileData = profileSnap.data();
        const selectedCourtId = profileData?.selectedCourtId;

        const selectedCourt = courts.find(c => c.id === selectedCourtId);
        return selectedCourt;
    } catch (error) {
        return undefined;
    }

    return;
};
