import { FetchPlaymates } from "@/utils/Playmates/FetchPlaymates";
import { PlayerProfile, Playmate } from "@/utils/TYPE";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { useProfile } from "./profileContext";

type playmateConstextType = {
    playmates:PlayerProfile[] | null;
    setPlaymates:React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
    loading:boolean
}
const playmatesContext = createContext<playmateConstextType | undefined>(undefined);

export const PlaymateProvider = ({children}:{children:React.ReactNode})=>{
    const [playmates, setPlaymates] = useState<PlayerProfile[]>([]);
    const [loading,setLoading] =  useState(false);
    const {user} = useAuth();
    const {selectedProfile} = useProfile()
        const fetchPlaymates = async () => {
            try {
                setLoading(true)
                const data = await FetchPlaymates({
                userUid: user?.uid,
                profileId: selectedProfile?.id
            })
            if (data) {
                setPlaymates(data)
            }
            } catch (error) {
                console.error("Failed to fetch playmates:", error);
            }
            finally{
                setLoading(false);
            }
        }
        useEffect(() => {
            if (user?.uid && selectedProfile?.id) {
                fetchPlaymates();
            }
        }, [user?.uid, selectedProfile?.id]);

        return(
            <playmatesContext.Provider value={{playmates,setPlaymates,loading}}>
                {children}
            </playmatesContext.Provider>
        )
}

export const  usePlaymates = ()=>{
    const context = useContext(playmatesContext);

    if(!context){
        throw new Error("there is no context");
    }
    return context
}