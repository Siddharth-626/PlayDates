import { db } from "@/services/config";
import { PlayerProfile, Playmate } from "@/utils/TYPE";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

type playmateConstextType = {
    playmates: PlayerProfile[] | null;
    setPlaymates: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
    loading: boolean
}
const playmatesContext = createContext<playmateConstextType | undefined>(undefined);

export const PlaymateProvider = ({ children }: { children: React.ReactNode }) => {
    const [playmates, setPlaymates] = useState<PlayerProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { selectedProfile } = useProfile()

    useEffect(() => {
        if (!user?.uid || !selectedProfile?.id) return;

        setLoading(true);

        // Listen to the profile document for playmate changes in real-time
        const profileRef = doc(db, "users", user.uid, "profile", selectedProfile.id);
        const unsubscribe = onSnapshot(profileRef, async (snapshot) => {
            try {
                const profileData = snapshot.data();
                if (!profileData || !Array.isArray(profileData.playmates) || profileData.playmates.length === 0) {
                    setPlaymates([]);
                    setLoading(false);
                    return;
                }

                const playmateFetches = profileData.playmates.map(async (playmate: any) => {
                    if (!playmate?.userUid || !playmate?.profileId) return null;

                    const PlaymateRef = doc(db, "users", playmate.userUid, "profile", playmate.profileId);
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
                setPlaymates(PlayMates);
            } catch (error) {
                console.error("Failed to fetch playmates:", error);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Failed to listen to profile:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid, selectedProfile?.id]);

    return (
        <playmatesContext.Provider value={{ playmates, setPlaymates, loading }}>
            {children}
        </playmatesContext.Provider>
    )
}

export const usePlaymates = () => {
    const context = useContext(playmatesContext);

    if (!context) {
        throw new Error("there is no context");
    }
    return context
}
