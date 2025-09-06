import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/config";


type MatchContextType = {
    matches: any[] | undefined,
    setMatches: React.Dispatch<React.SetStateAction<any[] | undefined>>;
    loading:boolean;
    refreshMatches:()=>void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [matches, setMatches] = useState<any[] | undefined>(undefined);
    const [loading,setLoading] = useState(false)
    const fetchData = async () => {
        try {
            setLoading(true)
            const colectionRef = collection(db, "users", user?.uid!, "profile", selectedProfile?.id!, "matches");
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
            console.log("err in the useFetchMatches Hook", err);

        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.uid && selectedProfile?.id) {
            fetchData();
        }
    }, [user?.uid, selectedProfile?.id])

    const refreshMatches = ()=>{
        fetchData();
    }
    return(
        <MatchContext.Provider value={{matches,setMatches,loading,refreshMatches}}>
            {children}
        </MatchContext.Provider>
    )
}

export const useMatchs = ()=>{
    const context = useContext(MatchContext);

    if(!context){
        throw new Error("THere is no match context");
    }
    return context
}