import { useAuth } from "@/context/authContext";
import { db } from "@/services/config";
import { PlayerProfile } from "@/utils/FetchPlayerProfiles";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import ProfileHeader from "@/components/profile/ProfilePage/ProfileHeader";
import ActionButtons from "@/components/profile/ProfilePage/ActionButtons";
import LocationsSection from "@/components/profile/ProfilePage/Location";

const PlayerPage = ({userId,profileId}:{userId:string,profileId:string}) => {
    const [player, setPlayer] = useState<any>(null)
    useEffect(() => {
        if (!profileId || typeof profileId !== "string" && !userId || typeof userId !== "string") return;
        const fetchPlayer = async () => {
            try {
                const profileRef = doc(db, `users/${userId}/profile/${profileId}`);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    setPlayer({ profileId, ...profileSnap.data() });
                } else {
                    console.warn("No profile found for ID:", profileId);
                }
            } catch (err) {
                console.error("Error fetching player profile:", err);
            }
        };
        fetchPlayer();
    }, [userId, profileId]);


    const handleAddPlaymate = () => {
        console.log("handleAddPlaymate");
    }
    if (!player) {
        return (
            <>
                <div className="text-center py-10">Loading player...</div>
            </>
        )
    }
    return (
        <>
            <motion.div
                className="max-w-5xl mx-auto space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <ProfileHeader profile={player} />
                <ActionButtons onAdd={handleAddPlaymate} />
                <LocationsSection locations={player.locations} />
            </motion.div>
        </>
    )
}
export default PlayerPage;