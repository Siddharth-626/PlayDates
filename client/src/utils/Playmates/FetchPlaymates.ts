import { db } from "@/services/config"
import { doc, getDoc } from "firebase/firestore"
import { PlayerProfile } from "../PlayerProfile/FetchPlayerProfiles";


export const FetchPlaymates = async ({ userUid, profileId }: { userUid: string | undefined, profileId: string | undefined }) => {
    try {
        if(!userUid || !profileId)return
        const ProfileRef = doc(db, "users", userUid, "profile", profileId)
        const ProfileSnap = await getDoc(ProfileRef);

        const ProfileData = ProfileSnap.data();

        if (!ProfileData || !Array.isArray(ProfileData.playmates)) return

        const PlayMates: PlayerProfile[] = [];

        for (const playmate of ProfileData.playmates) {
            if (!playmate) return
            const { userUid, profileId } = playmate;

            if (!userUid || !profileId) return;

            const PlaymateRef = doc(db, "users", userUid, "profile", profileId);
            const PlaymateSnap = await getDoc(PlaymateRef);
            const data = PlaymateSnap.data();

            if(data){
            PlayMates.push({
                id: PlaymateSnap.id,
                userUid: data.userUid,
                name: data.name || "",
                age: data.age || "",
                gender: data.gender || "",
                skill: data.skill || "",
                preferences: data.preferences || [],
                locations: data.locations || [],
                playmates: data.playmates || [],
                photoUrl: data.photoUrl || "",
                completed: data.completed || false,
            })
            }
            console.log("playmates fetch sucess");
        }
        return PlayMates;
    } catch (err) {
        console.log("er while fetching playmates");
    }
}