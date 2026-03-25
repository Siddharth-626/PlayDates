import { db } from "@/services/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type useFetchMatchesType = {
    userUid: string | undefined;
    profileId: string | undefined;
}
export const useFetchMatches = ({ userUid, profileId }: useFetchMatchesType) => {
    const [matches, setMatches] = useState<any[] | undefined>();

    useEffect(() => {
        if (!userUid || !profileId) return;

        const collectionRef = collection(db, "users", userUid, "profile", profileId, "matches");
        const unsubscribe = onSnapshot(
            collectionRef,
            (snapshot) => {
                const matchData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMatches(matchData);
            },
            (error) => {
                console.error("Failed to listen to matches:", error);
            }
        );

        return () => unsubscribe();
    }, [userUid, profileId]);

    return { matches };
}