import { useEffect, useState, useMemo } from "react";
import { PlayerProfile } from "@/utils/TYPE";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import PlayerPage from "@/components/profile/ProfilePage/Main";
import PlayerCard from "@/components/FindPlayers/PlayerCard";
import { FetchPlaymates } from "@/utils/Playmates/FetchPlaymates";
import { useProfile } from "@/context/profileContext";
import { Users, ArrowLeft } from "lucide-react";
import { Loading } from "@/components/ui/Loading";

export const DisplayPlaymates = () => {
  const [SelectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
  const [playmates, setPlaymates] = useState<PlayerProfile[]>([]);
  const [loadingPlaymates, setLoadingPlaymates] = useState(true);
  const { loading, user } = useAuth();
  const { selectedProfile } = useProfile();

  useEffect(() => {
    if (!user?.uid || !selectedProfile?.id) return;
    setLoadingPlaymates(true);
    FetchPlaymates({
      userUid: user.uid,
      profileId: selectedProfile.id,
    }).then((data) => {
      setPlaymates(data || []);
      setLoadingPlaymates(false);
    });
  }, [selectedProfile?.id, user?.uid]);

  // Memoize the grid for performance
  const playmatesGrid = useMemo(
    () => (
      <motion.div
        key="player-grid"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Playmates Grid"
      >
        {playmates.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div
              onClick={() => setSelectedProfile(player)}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
              tabIndex={0}
              role="button"
              aria-label={`View ${player.name}'s profile`}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedProfile(player);
              }}
            >
              <PlayerCard {...player} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    ),
    [playmates]
  );

  return (
    <div className="p-4 md:p-6 min-h-[70vh]">
      <h1 className="font-mono text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-200 flex items-center justify-center gap-2">
        <Users className="text-green-500 dark:text-green-300" size={32} /> Your Playmates
      </h1>

      <AnimatePresence mode="wait">
        {loadingPlaymates ? (
          <Loading />
        ) : !SelectedProfile ? (
          playmates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Users className="text-green-200 dark:text-green-700 mb-2" size={60} />
              <span className="text-gray-500 dark:text-gray-400 text-lg">No playmates found yet.</span>
            </motion.div>
          ) : (
            playmatesGrid
          )
        ) : (
          <motion.div
            key="player-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl p-6"
          >
            <div className="mb-4 flex justify-start">
              <Button
                variant="outline"
                className="text-sm flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-800 transition"
                onClick={() => setSelectedProfile(null)}
                aria-label="Back to playmates"
              >
                <ArrowLeft size={18} /> Back to playmates
              </Button>
            </div>
            <PlayerPage profileId={SelectedProfile.id} userId={SelectedProfile.userUid} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};