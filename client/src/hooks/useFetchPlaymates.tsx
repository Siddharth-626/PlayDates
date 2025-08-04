import { FetchPlaymates } from "@/utils/Playmates/FetchPlaymates";
import { PlayerProfile, Playmate } from "@/utils/TYPE"
import { log } from "node:console";
import { useEffect, useState } from "react"


export const useFetchPlaymates = ({ userUid, profileId }: { userUid: string | undefined, profileId: string | undefined }) => {
    const [playmates, setPlaymates] = useState<PlayerProfile[]>([]);
    const [loading,setLoading] =  useState(false);
    const [hasFetched,setHasFetched]= useState(false)
    const fetchPlaymates = async () => {
        try {
            setLoading(true)
            const data = await FetchPlaymates({
            userUid: userUid,
            profileId: profileId
        })
        if (data) {
            setPlaymates(data)
            setHasFetched(false)
        }
        } catch (error) {
            console.log("err in useFetch",error);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        if (userUid && profileId && !hasFetched) {
            fetchPlaymates();
        }
    }, []);
    useEffect(()=>{
        console.log(playmates);
    },[playmates])

    return { playmates, setPlaymates,loading };
}