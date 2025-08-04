import { db } from "@/services/config";
import { doc, getDoc } from "firebase/firestore";
import { PlayerProfile } from "../TYPE";

export const FetchPlaymates = async ({
    userUid,
    profileId,
}: {
    userUid: string | undefined;
    profileId: string | undefined;
}) => {
    try {
        if (!userUid || !profileId) return;

        const ProfileRef = doc(db, "users", userUid, "profile", profileId);
        const ProfileSnap = await getDoc(ProfileRef);
        const ProfileData = ProfileSnap.data();

        if (!ProfileData || !Array.isArray(ProfileData.playmates)) return [];

        const playmateFetches = ProfileData.playmates.map(async (playmate: any) => {
            if (!playmate) return null;

            const { userUid, profileId } = playmate;
            if (!userUid || !profileId) return null;

            const PlaymateRef = doc(db, "users", userUid, "profile", profileId);
            const PlaymateSnap = await getDoc(PlaymateRef);
            const data = PlaymateSnap.data();
            if (!data) return null;

            return {
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
            } as PlayerProfile;
        });

        const PlaymateDocs = await Promise.all(playmateFetches);
        const PlayMates: PlayerProfile[] = PlaymateDocs.filter(Boolean) as PlayerProfile[];

        console.log("playmates fetch success");
        return PlayMates;
    } catch (err) {
        console.log("err while fetching playmates", err);
        return [];
    }
};
