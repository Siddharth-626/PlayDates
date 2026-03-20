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
        // silently fail
      }
    };
    fetchPlayer();
  }, [userId, profileId]);

  const handleAddPlaymate = async () => {
    if (!user?.uid || !selectedProfile?.id || !userId || !profileId) return;

    try {
      await sendPlayMatesRequest({
        fromUserUid: user.uid,
        fromProfileId: selectedProfile.id,
        toUserUid: userId,
        toProfileId: profileId,
      });
      setActionBtnStatus("pending");
    } catch (err) {
      // silently fail
    }
  };

  if (!player) {
    return <Loading />;
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 
                 bg-white/90 dark:bg-gray-900/90 
                 rounded-2xl shadow-lg sm:shadow-xl 
                 backdrop-blur-md border border-green-200 dark:border-green-700 
                 transition-colors duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      aria-label="Player Profile Page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="flex items-center gap-2 mb-6"
      >
        <UserPlus className="w-6 h-6 text-green-600 dark:text-green-300" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-green-800 dark:text-green-200">
          Player Profile
        </h1>
      </motion.div>

      {/* Profile Header */}
      <div className="mb-6">
        <ProfileHeader profile={player} />
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        className="mb-6"
      >
        <ActionButtons onAdd={handleAddPlaymate} player={player} />
      </motion.div>

      {/* Locations */}
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
