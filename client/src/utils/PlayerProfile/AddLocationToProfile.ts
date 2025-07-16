import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LocationStorageType } from "../TYPE";
import { db } from "@/services/config";


export const AddLocationToProfile = async (userUid: string | undefined, profileId: string | undefined, location: LocationStorageType | undefined) => {
    if(!userUid || !profileId || !location) return;
    try {
        const ProfileRef = doc(db, "users", userUid, "profile", profileId);
        const ProfileSnap = await getDoc(ProfileRef);
        const ProfileData = ProfileSnap?.data();

        if (!ProfileData) return

        const Locations: LocationStorageType[] = ProfileData.locations;
        Locations.push(location);

        await updateDoc(ProfileRef,{
            locations:Locations
        })
    } catch (err) {
        console.log("err while adding location to profile");
    }
}