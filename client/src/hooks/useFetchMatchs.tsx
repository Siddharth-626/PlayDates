import { db } from "@/services/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type useFetchMatchesType = {
    userUid: string | undefined;
    profileId: string | undefined;
}
export const useFetchMatches = ({ userUid, profileId }: useFetchMatchesType) => {
    const [matches, setMatches] = useState<any[] | undefined>();

    const fetchData = async () => {
        try {
            const colectionRef = collection(db, "users", userUid!, "profile", profileId!, "matches");
            const colectionSnap = await getDocs(colectionRef);

            if (!colectionSnap) return;

            const MatchData = colectionSnap.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    ...data
                }
            })
            setMatches(MatchData);
        } catch (err) {
            // silently fail
        }
    }

    useEffect(() => {
        if(userUid && profileId) {
            fetchData();
        }
    }, [userUid, profileId])
    return {matches};
}