import { db } from "@/services/config";
import { collection, getDocs } from "firebase/firestore"
import { PlayerProfile } from "../TYPE";



export const FetchPlayerProfiles = async (uid: string | undefined): Promise<PlayerProfile[]> => {
    if(!uid){return [];}

    const profileRef = collection(db, `users/${uid}/profile`);
    const snapshot = await getDocs(profileRef);

    const profiles: PlayerProfile[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            userUid:data.userUid,
            name: data.name || "",
            age: data.age || "",
            gender: data.gender || "",
            skill: data.skill || "",
            preferences: data.preferences || [],
            locations: data.locations || [],
            playmates:[],
            photoUrl:data.photoUrl,
            completed: data.completed || false,
        };
    });

    return profiles;
};
