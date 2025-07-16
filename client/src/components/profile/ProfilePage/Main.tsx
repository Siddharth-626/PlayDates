import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import ProfileHeader from "@/components/profile/ProfilePage/ProfileHeader";
import ActionButtons from "@/components/profile/ProfilePage/ActionButtons";
import LocationsSection from "@/components/profile/ProfilePage/Location";
import { sendPlayMatesRequest } from "@/utils/Playmates/sendPlaymatesRequest";
import { useProfile } from "@/context/profileContext";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";

const PlayerPage = ({ userId, profileId }: { userId: string, profileId: string }) => {
    const [player, setPlayer] = useState<any>(null);
    const [ActionBtnStatus, setActionBtnStatus] = useState('');
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    useEffect(() => {
        if (!profileId || typeof profileId !== "string" || !userId || typeof userId !== "string") return;
        const fetchPlayer = async () => {
            try {
                const data = await FetchPlayerProfile({
                    userUid: userId,
                    profileId: profileId
                })
                setPlayer(data);
            } catch (err) {
                console.error("Error fetching player profile:", err);
            }
        };
        fetchPlayer();
    }, [userId, profileId]);

    const handleAddPlaymate = async () => {
        if (!user?.uid || !selectedProfile?.id || !userId || !profileId) {
            console.warn("Missing necessary IDs to send request");
            return;
        }

        try {
            await sendPlayMatesRequest({
                fromUserUid: user.uid,
                fromProfileId: selectedProfile.id,
                toUserUid: userId,
                toProfileId: profileId
            });
            console.log("Playmate request sent");
            setActionBtnStatus('pending');
        } catch (err) {
            console.error("Error sending playmate request:", err);
        }
    };

    if (!player) {
        return (
            <div className="text-center py-10">Loading player...</div>
        );
    }
    return (
        <motion.div
            className="max-w-5xl mx-auto space-y-6 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <ProfileHeader profile={player} />
            <ActionButtons onAdd={handleAddPlaymate} player={player} />
            <LocationsSection locations={player.locations} />
        </motion.div>
    );
};

export default PlayerPage;
