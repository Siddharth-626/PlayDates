
import { useEffect, useState } from "react";
import { PlayerProfile } from "@/utils/TYPE";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import PlayerPage from "@/components/profile/ProfilePage/Main";
import PlayerCard from "@/components/FindPlayers/PlayerCard";
import { FetchPlaymates } from "@/utils/Playmates/FetchPlaymates";
import { useProfile } from "@/context/profileContext";


export const DisplayPlaymates = () => {
    const [SelectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
    const [playmates, setPlaymates] = useState<PlayerProfile[]>([]);
    const { loading, user } = useAuth();
    const { selectedProfile } = useProfile();
    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchPlaymates({
                userUid: user?.uid,
                profileId: selectedProfile?.id,
            });

            if (data) {
                setPlaymates(data);
            }
        };
        fetchData();
    }, [selectedProfile?.id, user?.uid, loading]);

    return (
        <div className="p-6">
            <h1 className="font-mono text-3xl font-bold mb-6 text-center text-green-700">Your Playmates</h1>

            <AnimatePresence mode="wait">
                {!SelectedProfile ? (
                    <motion.div
                        key="player-grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {playmates.map((player, i) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div
                                    onClick={() => setSelectedProfile(player)}
                                    className="cursor-pointer hover:scale-105 transition-transform"
                                >
                                    <PlayerCard {...player} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="player-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6"
                    >
                        <div className="mb-4 flex justify-end">
                            <Button
                                variant="outline"
                                className="text-sm"
                                onClick={() => setSelectedProfile(null)}
                            >
                                ← Back to playmates
                            </Button>
                        </div>
                        <PlayerPage
                            profileId={SelectedProfile.id}
                            userId={SelectedProfile.userUid}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}