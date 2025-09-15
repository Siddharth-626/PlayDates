'use client'

import { Player } from "@/utils/TYPE";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type TeamSelectorType = {
    players: Player[];
    OnClose: () => void;
    OnSubmit: (players: Player[]) => void;
};

export const TeamsSelector = ({ players, OnClose, OnSubmit }: TeamSelectorType) => {
    const [assignedPlayers, setAssignedPlayers] = useState<
        (any & { team?: "team1" | "team2" })[]
    >(players);

    const handleAssign = (id: string, team: "team1" | "team2") => {
        setAssignedPlayers((prev) =>
            prev.map((p) => (p.profileId === id ? { ...p, team } : p))
        );
    };

    const handleSubmit = () => {
        OnSubmit(assignedPlayers);
        OnClose();
        toast.success("Teams Selected")
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-md p-6 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Users size={22} /> Select Teams
                </h2>
            </div>

            {/* Players list */}
            <div className="grid gap-4 md:gap-5">
                {assignedPlayers.map((player) => (
                    <motion.div
                        key={player.profileId}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border rounded-xl dark:border-neutral-700"
                    >
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm md:text-base">
                            {player.name}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={player.team === "team1" ? "default" : "outline"}
                                className={`rounded-full px-4 ${player.team === "team1"
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : ""
                                    }`}
                                onClick={() => handleAssign(player.profileId, "team1")}
                            >
                                Team 1
                                {player.team === "team1" && (
                                    <CheckCircle2 className="ml-1" size={16} />
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant={player.team === "team2" ? "default" : "outline"}
                                className={`rounded-full px-4 ${player.team === "team2"
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : ""
                                    }`}
                                onClick={() => handleAssign(player.profileId, "team2")}
                            >
                                Team 2
                                {player.team === "team2" && (
                                    <CheckCircle2 className="ml-1" size={16} />
                                )}
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">
                <Button
                    variant="outline"
                    onClick={OnClose}
                    className="rounded-full w-full md:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="rounded-full w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white"
                >
                    Confirm Teams
                </Button>
            </div>
        </motion.div>
    );
};
