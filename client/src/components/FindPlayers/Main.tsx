'use client'

import { db } from "@/services/config";
import { PlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfiles";
import { collectionGroup, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';
import Filters from './FilterPlayers';
import SearchBar from './SearchBar'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import PlayerPage from "../profile/ProfilePage/Main";
import { Button } from "@/components/ui/button"; // Ensure you have shadcn/ui or a button component

export const FindPlayers = () => {
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [filtered, setFiltered] = useState<PlayerProfile[]>([]);
    const [searchItem, setSearchItem] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!user || loading) return;

            try {
                const snapshot = await getDocs(collectionGroup(db, 'profile'));
                const Players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlayerProfile[];
                setPlayers(Players);
                setFiltered(Players);
            } catch (error) {
                console.error("Error while fetching players:", error);
                toast.error("Error fetching players");
            }
        };

        fetchPlayers();
    }, [user, loading]);

    useEffect(() => {
        const result = players.filter(player =>
            (!locationFilter || player.locations.includes(locationFilter)) &&
            (!skillFilter || player.skill === skillFilter) &&
            (!searchItem || player.name.toLowerCase().includes(searchItem.toLowerCase()))
        );
        setFiltered(result);
        setSelectedProfile(null);
    }, [locationFilter, skillFilter, searchItem, players]);

    return (
        <div className="p-6">
            <h1 className="font-mono text-3xl font-bold mb-6 text-center text-green-700">Find Players</h1>

            {!selectedProfile && (
                <div className="flex flex-col lg:flex-col items-center gap-4 mb-8">
                    <SearchBar value={searchItem} onChange={setSearchItem} />
                    <Filters
                        onLocationChange={setLocationFilter}
                        onSkillChange={setSkillFilter}
                        selectedLocation={locationFilter}
                        selectedSkill={skillFilter}
                    />
                </div>
            )}

            <AnimatePresence mode="wait">
                {!selectedProfile ? (
                    <motion.div
                        key="player-grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                                ← Back to players
                            </Button>
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
