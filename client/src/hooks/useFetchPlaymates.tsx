import { FetchPlaymates } from "@/utils/Playmates/FetchPlaymates";
import { PlayerProfile } from "@/utils/TYPE"
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
            setHasFetched(true)
        }
        } catch (error) {
            console.error("Failed to fetch playmates:", error);
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

    return { playmates, setPlaymates,loading };
}
