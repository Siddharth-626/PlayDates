import { useEffect, useState, useMemo } from "react";
import { PlayerProfile } from "@/utils/TYPE";
import { AnimatePresence, motion } from "framer-motion";
import { Users, ArrowLeft, Search } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import PlayerPage from "@/components/profile/ProfilePage/Main";
import PlayerCard from "@/components/FindPlayers/PlayerCard";
import { usePlaymates } from "@/context/playmatesContext";

export const DisplayPlaymates = () => {
    const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
    const [search, setSearch] = useState("");
    const { playmates, loading } = usePlaymates();

    const filtered = useMemo(() => {
        if (!playmates) return [];
        if (!search.trim()) return playmates;
        return playmates.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [playmates, search]);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#0d1b2a] p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
                <Users className="w-5 h-5 text-[#22c55e]" />
                <h1 className="text-[22px] font-bold text-white">Your Playmates</h1>
            </div>

            <AnimatePresence mode="wait">
                {!selectedProfile ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Search bar */}
                        {(playmates?.length ?? 0) > 0 && (
                            <div className="flex items-center bg-[#1a2a3a] border border-[#2d4a3e] rounded-xl px-3 py-2.5 gap-2 mb-5">
                                <Search className="w-4 h-4 text-[#22c55e] shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search your playmates..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#6b7280]"
                                />
                            </div>
                        )}

                        {/* Empty state */}
                        {(playmates?.length ?? 0) === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <Users className="w-12 h-12 text-[#2d4a3e] mb-3" />
                                <p className="text-[#6b7280] font-medium">No playmates yet.</p>
                                <p className="text-sm text-[#4b5563] mt-1">
                                    Find players and send a connection request.
                                </p>
                            </motion.div>
                        ) : filtered.length === 0 ? (
                            <p className="text-center text-[#6b7280] py-12">
                                No playmates match your search.
                            </p>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {filtered.map((player, i) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <div
                                            onClick={() => setSelectedProfile(player)}
                                            className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`View ${player.name}'s profile`}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ")
                                                    setSelectedProfile(player);
                                            }}
                                        >
                                            <PlayerCard player={player} />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="flex items-center gap-2 text-[13px] text-[#94a3b8] hover:text-white transition-colors mb-4 border border-[#1e3040] px-3 py-2 rounded-xl hover:border-[#22c55e]"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to playmates
                        </button>
                        <div className="bg-[#111f2e] border border-[#1e3040] rounded-2xl p-6">
                            <PlayerPage
                                profileId={selectedProfile.id}
                                userId={selectedProfile.userUid}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
