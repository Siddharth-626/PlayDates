import { PlayerProfile } from "@/utils/TYPE";
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';
import Filters from './FilterPlayers';
import SearchBar from './SearchBar'
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import PlayerPage from "../profile/ProfilePage/Main";
import { Loading } from "../ui/Loading";
import { Users, ArrowLeft } from "lucide-react";
import { FetchAllPlayers } from "@/utils/FindPlayers/FetchAllPlayers";

export const FindPlayers = () => {
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [filtered, setFiltered] = useState<PlayerProfile[]>([]);
    const [searchItem, setSearchItem] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setFetchLoading(true);
                setFetchError(null);
                const allplayers = await FetchAllPlayers();
                if (!allplayers) return;

                setPlayers(allplayers);
                setFiltered(allplayers);
            } catch (error) {
                console.error("Failed to fetch players:", error);
                setFetchError("Failed to load players. Please try again.");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchPlayers();
    }, [user, loading]);

    useEffect(() => {
        const result = players.filter(player =>
            // item 14: exclude own profiles by matching userUid
            player.userUid !== user?.uid &&
            (
                !locationFilter ||
                player.locations.some(loc => loc.name.toLowerCase().includes(locationFilter.toLowerCase()))
            ) &&
            (
                !skillFilter || player.skill === skillFilter
            ) &&
            (
                !searchItem || player.name.toLowerCase().includes(searchItem.toLowerCase())
            )
        );
        setFiltered(result);
        setSelectedProfile(null);
    }, [locationFilter, skillFilter, searchItem, players, user?.uid]);

    if (fetchLoading) return <Loading />;
    if (fetchError) return <div className="text-center text-red-600 py-16">{fetchError}</div>;

    return (
        <div className="p-5 md:p-8 min-h-screen">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 mb-6"
            >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[var(--accent-green)]" />
                </div>
                <div>
                    <h1 className="font-outfit text-[20px] font-bold text-[var(--content-primary)] leading-tight">Find Players</h1>
                    <p className="text-[12px] text-[var(--content-muted)]">Discover tennis partners near you</p>
                </div>
            </motion.div>

            {!selectedProfile && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="flex flex-col items-center gap-4 mb-8"
                >
                    <SearchBar value={searchItem} onChange={setSearchItem} />
                    <Filters
                        onLocationChange={setLocationFilter}
                        onSkillChange={setSkillFilter}
                        selectedLocation={locationFilter}
                        selectedSkill={skillFilter}
                    />
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {!selectedProfile ? (
                    filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex flex-col items-center justify-center py-16 text-[var(--content-muted)]"
                        >
                            <p>No players found matching your filters.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="player-grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit=


                            {{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            aria-label="Players Grid"
                        >
                            {filtered.map((player, i) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div
                                        onClick={() => setSelectedProfile(player)}
                                        className="cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View ${player.name}'s profile`}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setSelectedProfile(player);
                                        }}
                                    >
                                        <PlayerCard player={player} hideAction />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )
                ) : (
                    <motion.div
                        key="player-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="mb-4 flex justify-start">
                            <button
                                onClick={() => setSelectedProfile(null)}
                                aria-label="Back to players"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]
                                           text-[var(--content-secondary)] hover:text-[var(--content-primary)]
                                           hover:bg-[var(--surface-inset)] transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to players
                            </button>
                        </div>
                        <PlayerPage
                            profileId={selectedProfile.id}
                            userId={selectedProfile.userUid}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
