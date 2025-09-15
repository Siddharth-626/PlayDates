'use client'

import { db } from "@/services/config";
import { PlayerProfile } from "@/utils/TYPE";
import { collectionGroup, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';
import Filters from './FilterPlayers';
import SearchBar from './SearchBar'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import PlayerPage from "../profile/ProfilePage/Main";
import { Button } from "@/components/ui/button";
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
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchPlayers = async () => {
            const allplayers = await FetchAllPlayers();
            if (!allplayers) return;

            setPlayers(allplayers);
            setFiltered(allplayers);
        };

        fetchPlayers();
    }, [user, loading]);

    useEffect(() => {
        const result = players.filter(player =>
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
    }, [locationFilter, skillFilter, searchItem, players]);

    if (!filtered) return <Loading />;

    return (
        <div className="p-4 md:p-8 min-h-[80vh]">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="font-mono text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-200 flex items-center justify-center gap-2"
            >
                <Users className="text-green-500 dark:text-green-300" size={32} />
                Find Players
            </motion.h1>

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
                            className="flex flex-col items-center justify-center py-16"
                        >
                            <Loading />
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
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setSelectedProfile(player);
                                        }}
                                    >
                                        <PlayerCard player={player} />
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
                        className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6"
                    >
                        <div className="mb-4 flex justify-start">
                            <Button
                                variant="outline"
                                className="text-sm flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                onClick={() => setSelectedProfile(null)}
                                aria-label="Back to players"
                            >
                                <ArrowLeft size={18} /> Back to players
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
