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
        <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--surface-base)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--accent-green)15' }}
                >
                    <Users className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
                </div>
                <div>
                    <h1 className="font-outfit text-xl font-bold" style={{ color: 'var(--content-primary)' }}>Your Playmates</h1>
                    <p className="text-xs" style={{ color: 'var(--content-muted)' }}>Connect and play with friends</p>
                </div>
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
                            <div
                                className="flex items-center rounded-xl px-3 py-2.5 gap-2 mb-5 border"
                                style={{ background: 'var(--surface-overlay)', borderColor: 'var(--border-subtle)' }}
                            >
                                <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-green)' }} />
                                <input
                                    type="text"
                                    placeholder="Search your playmates..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    style={{ color: 'var(--content-primary)' }}
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
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-float"
                                    style={{ background: 'var(--surface-overlay)' }}
                                >
                                    <Users className="w-7 h-7" style={{ color: 'var(--content-muted)' }} />
                                </div>
                                <p className="font-semibold" style={{ color: 'var(--content-secondary)' }}>No playmates yet</p>
                                <p className="text-sm mt-1 mb-4" style={{ color: 'var(--content-muted)' }}>
                                    Find players and send a connection request.
                                </p>
                            </motion.div>
                        ) : filtered.length === 0 ? (
                            <p className="text-center text-sm py-12" style={{ color: 'var(--content-muted)' }}>
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
                                            <PlayerCard player={player} hideAction />
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
                            className="flex items-center gap-2 text-[13px] transition-colors mb-4 border px-3 py-2 rounded-xl"
                            style={{
                                color: 'var(--content-secondary)',
                                borderColor: 'var(--border-subtle)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--content-primary)';
                                e.currentTarget.style.borderColor = 'var(--accent-green)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--content-secondary)';
                                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to playmates
                        </button>
                        <div className="rounded-2xl p-6 border" style={{ background: 'var(--surface-raised)', borderColor: 'var(--border-subtle)' }}>
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
