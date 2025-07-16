import { db } from "@/services/config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { courtType } from "../TYPE";



export const addSelectedCourtToDb = async (userUid: string, profileId: string, courtId: string | null) => {
    if (!userUid || !profileId || !courtId) return;
    try {
        const ProfileRef = doc(db, "users", userUid, "profile", profileId,);
        await updateDoc(ProfileRef,{
            selectedCourtId:courtId
        })
    } catch (err) {
        console.log("err while add selected court to db",err);
    }
}