import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllCourts } from "@/utils/courts/fetchAllCourts";
import { fetchSelectedCourt } from "@/utils/courts/fetchSelectedCourt";
import { courtType } from "@/utils/TYPE";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";

type courtContextType = {
    selectedCourt: courtType | undefined;
    setSelectedCourt: (selectedCourt: courtType | undefined) => void;
    courts: courtType[] | undefined;
};

const courtContext = createContext<courtContextType | undefined>(undefined);

export const CourtProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [selectedCourt, setSelectedCourt] = useState<courtType | undefined>(undefined);
    const [courts, setCourts] = useState<courtType[] | undefined>([]);

    useEffect(() => {
        if (!user || !selectedProfile) return;

        const fetchData = async () => {
            try {
                const allCourts = await fetchAllCourts();
                setCourts(allCourts);
            } catch (error) {
                console.error("Failed to fetch courts:", error);
            }
        };

        fetchData();
    }, [user, selectedProfile]);

    return (
        <courtContext.Provider value={{ selectedCourt, setSelectedCourt, courts }}>
            {children}
        </courtContext.Provider>
    );
};

export const useCourt = () => {
    const context = useContext(courtContext);
    if (!context) {
        throw new Error("court context not found");
    }
    return context;
};
