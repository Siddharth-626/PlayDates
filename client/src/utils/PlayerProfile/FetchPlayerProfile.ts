import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/config";

export const FetchPlayerProfile = async ({ userUid, profileId }: { userUid: string; profileId: string }) => {
    if (!userUid || !profileId) return null;

    try {
        const ProfileRef = doc(db, "users", userUid, "profile", profileId);
        const ProfileSnap = await getDoc(ProfileRef);
        const data = ProfileSnap.data();
        if (!data) return null;

        return {
            id: ProfileSnap.id,
            userUid: data.userUid,
            name: data.name || "",
            age: data.age || "",
            gender: data.gender || "",
            skill: data.skill || "",
            preferences: data.preferences || [],
            locations: data.locations || [],
            playmates: data.playmates || [],
            photoUrl: data.photoUrl,
            completed: data.completed || false,
        };
    } catch (err) {
        return null;
    }
};
