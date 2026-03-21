import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";
import { collection, onSnapshot } from "firebase/firestore";
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

        const unsubscribe = onSnapshot(colectionRef, (snapshot) => {
            const MatchData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setMatches(MatchData);
            setLoading(false);
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
