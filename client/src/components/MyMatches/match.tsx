import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { respondToMatchPreposal } from "@/utils/MatchPreposal/respondToMAtchPreposal";
import toast from "react-hot-toast";
import { DisplayMatch } from "./displayMatch";
import { useState } from "react";
import { CreateMatch } from "./CreateMatch";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trophy } from "lucide-react";

export const DisplayMatches = ({ matches }: { matches: any[] | undefined }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past" | "pending">("all");

    const handleMatchPreposalResponse = async (status: string, matchId: string) => {
        if (!user?.uid || !selectedProfile?.id || !matchId) return;
        await respondToMatchPreposal({
            matchId,
            userUid: user.uid,
            profileId: selectedProfile.id,
            status,
        });
        toast.success(status === "accepted" ? "Match accepted!" : "Match rejected.");
        setIsCreateOpen(false);
    };

    if (!matches) return null;

    const pendingCount = matches.filter((m) => m.status === "pending").length;

    const filters: { key: "all" | "upcoming" | "past" | "pending"; label: string }[] = [
        { key: "all", label: "All" },
        { key: "upcoming", label: "Upcoming" },
        { key: "past", label: "Past" },
        { key: "pending", label: "Invites" },
    ];

    const filteredMatches = matches.filter((m) => {
        if (activeFilter === "upcoming") return m.status === "accepted";
        if (activeFilter === "past") return m.status === "rejected";
        if (activeFilter === "pending") return m.status === "pending";
        return true;
    });

    return (
        <div className="min-h-screen bg-[#0d1b2a] p-4 md:p-6 space-y-5">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-[#22c55e]" />
                    <h1 className="text-[22px] font-bold text-white">My Matches</h1>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCreateOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22c55e] text-black font-bold text-sm shadow-[0_4px_14px_rgba(34,197,94,0.35)] transition-all"
                >
                    {isCreateOpen ? (
                        <>
                            <X className="w-4 h-4" /> Close
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" /> Create Match
                        </>
                    )}
                </motion.button>
            </div>

            {/* ── Create Match Form ─────────────────────────────────── */}
            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <CreateMatch CloseTab={() => setIsCreateOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Filter tabs ───────────────────────────────────────── */}
            {!isCreateOpen && (
                <>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                    activeFilter === f.key
                                        ? "bg-[#22c55e] text-black shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                        : "bg-[#111f2e] text-[#94a3b8] border border-[#1e3040] hover:border-[#22c55e] hover:text-white"
                                }`}
                            >
                                {f.label}
                                {f.key === "pending" && pendingCount > 0 && (
                                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-red-500 text-white rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Match list ───────────────────────────────────── */}
                    <div className="space-y-3">
                        {filteredMatches.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <Trophy className="w-12 h-12 text-[#2d4a3e] mb-3" />
                                <p className="text-[#6b7280] font-medium">No matches here.</p>
                                <p className="text-[#4b5563] text-sm mt-1">
                                    Create one with the button above!
                                </p>
                            </motion.div>
                        ) : (
                            filteredMatches.map((match: any) => (
                                <motion.div
                                    key={match.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <DisplayMatch
                                        match={match}
                                        onRespond={handleMatchPreposalResponse}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
