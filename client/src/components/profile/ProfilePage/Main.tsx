import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProfileHeader from "@/components/profile/ProfilePage/ProfileHeader";
import ActionButtons from "@/components/profile/ProfilePage/ActionButtons";
import LocationsSection from "@/components/profile/ProfilePage/Location";
import { sendPlayMatesRequest } from "@/utils/Playmates/sendPlaymatesRequest";
import { useProfile } from "@/context/profileContext";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { Loading } from "@/components/ui/Loading";
import { UserPlus } from "lucide-react";

const PlayerPage = ({ userId, profileId }: { userId: string; profileId: string }) => {
  const [player, setPlayer] = useState<any>(null);
  const [actionBtnStatus, setActionBtnStatus] = useState("");
  const { user } = useAuth();
  const { selectedProfile } = useProfile();

  useEffect(() => {
    if (!profileId || typeof profileId !== "string" || !userId || typeof userId !== "string") return;
    const fetchPlayer = async () => {
      try {
        const data = await FetchPlayerProfile({
          userUid: userId,
          profileId: profileId,
        });
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
        toProfileId: profileId,
      });
      setActionBtnStatus("pending");
    } catch (err) {
      console.error("Error sending playmate request:", err);
    }
  };

  if (!player) {
    return <Loading />;
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl backdrop-blur-lg border border-green-200 dark:border-green-700 transition-colors duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      aria-label="Player Profile Page"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="flex items-center gap-2 mb-2"
      >
        <UserPlus className="w-7 h-7 text-green-600 dark:text-green-300" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 dark:text-green-200">
          Player Profile
        </h1>
      </motion.div>
      <ProfileHeader profile={player} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      >
        <ActionButtons
          onAdd={handleAddPlaymate}
          player={player}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
      >
        <LocationsSection locations={player.locations} />
      </motion.div>
    </motion.div>
  );
};

export default PlayerPage;
