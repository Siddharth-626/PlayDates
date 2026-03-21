import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { LocationStorageType } from "../TYPE";
import { db } from "@/services/config";


export const AddLocationToProfile = async (userUid: string | undefined, profileId: string | undefined, location: LocationStorageType | undefined) => {
    if(!userUid || !profileId || !location) return;
    try {
        const ProfileRef = doc(db, "users", userUid, "profile", profileId);
        await updateDoc(ProfileRef, {
            locations: arrayUnion(location)
        });
    } catch (err) {
        console.error("Error while adding location to profile:", err);
    }
}