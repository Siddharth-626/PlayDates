import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/config";


type MatchRecord = {
    id: string;
    [key: string]: unknown;
};

type MatchContextType = {
    matches: MatchRecord[] | undefined,
    setMatches: React.Dispatch<React.SetStateAction<MatchRecord[] | undefined>>;
    loading: boolean;
    refreshMatches: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [matches, setMatches] = useState<MatchRecord[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.uid || !selectedProfile?.id) return;

        setLoading(true);
        const colectionRef = collection(db, "users", user.uid, "profile", selectedProfile.id, "matches");

        const unsubscribe = onSnapshot(colectionRef, async (snapshot) => {
            const profileMatches = snapshot.docs.map((matchDoc) => ({
                id: matchDoc.id,
                ...matchDoc.data()
            }));

            if (profileMatches.length === 0) {
                setMatches([]);
                setLoading(false);
                return;
            }

            try {
                const hydratedMatches = await Promise.all(
                    profileMatches.map(async (profileMatch) => {
                        const matchId =
                            typeof profileMatch.matchId === "string" && profileMatch.matchId.length > 0
                                ? profileMatch.matchId
                                : profileMatch.id;

                        if (!matchId) return profileMatch;

                        const matchSnap = await getDoc(doc(db, "matches", matchId));
                        if (!matchSnap.exists()) return profileMatch;

                        const matchData = matchSnap.data();
                        return {
                            ...profileMatch,
                            date: profileMatch.date ?? matchData.date,
                            startTime: profileMatch.startTime ?? matchData.startTime,
                            endTime: profileMatch.endTime ?? matchData.endTime,
                            matchDate: profileMatch.matchDate ?? matchData.date,
                        };
                    })
                );

                setMatches(hydratedMatches);
            } catch (error) {
                console.error("Failed to hydrate matches:", error);
                setMatches(profileMatches);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Failed to fetch matches:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid, selectedProfile?.id]);

    const refreshMatches = () => {
        // No-op: onSnapshot handles real-time updates automatically
    };

    return (
        <MatchContext.Provider value={{ matches, setMatches, loading, refreshMatches }}>
            {children}
        </MatchContext.Provider>
    )
}

export const useMatchs = () => {
    const context = useContext(MatchContext);

    if (!context) {
        throw new Error("THere is no match context");
    }
    return context
}
