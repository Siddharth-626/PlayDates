'use client'

import { Player } from "@/utils/TYPE";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";

type TeamSelectorType = {
    players: Player[];
    OnClose: () => void;
    OnSubmit: (players: Player[]) => void;
};

const TEAM_CONFIG = {
    team1: {
        label: "Team 1",
        activeClass: "bg-[var(--accent-green)] text-white border-[var(--accent-green)]",
        badgeClass: "bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/30",
    },
    team2: {
        label: "Team 2",
        activeClass: "bg-blue-500 text-white border-blue-500",
        badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    },
};

export const TeamsSelector = ({ players, OnClose, OnSubmit }: TeamSelectorType) => {
    const [assignedPlayers, setAssignedPlayers] = useState<(any & { team?: "team1" | "team2" })[]>(players);

    const handleAssign = (id: string, team: "team1" | "team2") => {
        setAssignedPlayers((prev) =>
            prev.map((p) => (p.profileId === id ? { ...p, team } : p))
        );
    };

    const handleSubmit = () => {
        const unassigned = assignedPlayers.filter((p) => !p.team);
        if (unassigned.length > 0) {
            toast.error(`Please assign all players to a team`);
            return;
        }
        OnSubmit(assignedPlayers);
        OnClose();
        toast.success("Teams updated!");
    };

    const team1Count = assignedPlayers.filter((p) => p.team === "team1").length;
    const team2Count = assignedPlayers.filter((p) => p.team === "team2").length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
        >
            {/* Team summary */}
            <div className="grid grid-cols-2 gap-2">
                {(["team1", "team2"] as const).map((team) => {
                    const config = TEAM_CONFIG[team];
                    const count = team === "team1" ? team1Count : team2Count;
                    return (
                        <div key={team} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${config.badgeClass}`}>
                            <span className="text-[13px] font-semibold">{config.label}</span>
                            <span className="text-[12px] font-bold">{count} player{count !== 1 ? "s" : ""}</span>
                        </div>
                    );
                })}
            </div>

            {/* Player list */}
            <div className="space-y-2">
                {assignedPlayers.map((player) => (
                    <motion.div
                        key={player.profileId}
                        whileHover={{ scale: 1.005 }}
                        className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)]"
                    >
                        <span className="text-[14px] font-semibold text-[var(--content-primary)] flex-1 truncate mr-3">
                            {player.name}
                        </span>
                        <div className="flex gap-1.5">
                            {(["team1", "team2"] as const).map((team) => {
                                const config = TEAM_CONFIG[team];
                                const isActive = player.team === team;
                                return (
                                    <button
                                        key={team}
                                        onClick={() => handleAssign(player.profileId, team)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                                            isActive
                                                ? config.activeClass
                                                : "bg-[var(--surface-raised)] border-[var(--border-subtle)] text-[var(--content-muted)] hover:border-[var(--border-default)]"
                                        }`}
                                    >
                                        {config.label}
                                        {isActive && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={OnClose}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-[var(--border-subtle)] text-[var(--content-secondary)] text-[13px] font-semibold hover:bg-[var(--surface-inset)] transition-all"
                >
                    <X className="w-4 h-4" /> Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[var(--accent-green)] text-white text-[13px] font-semibold hover:opacity-90 transition-all"
                >
                    <Users className="w-4 h-4" /> Confirm Teams
                </button>
            </div>
        </motion.div>
    );
};
