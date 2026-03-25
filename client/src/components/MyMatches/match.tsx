import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { respondToMatchPreposal } from "@/utils/MatchPreposal/respondToMAtchPreposal";
import toast from "react-hot-toast";
import { DisplayMatch } from "./displayMatch";
import { useState } from "react";
import { CreateMatch } from "./CreateMatch";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trophy } from "lucide-react";
import { isPastMatch, isUpcomingMatch } from "@/utils/Match/matchDate";

export const DisplayMatches = ({ matches }: { matches: any[] | undefined }) => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past" | "pending">("all");

    const handleMatchPreposalResponse = async (status: string, matchId: string): Promise<void> => {
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

    const now = new Date();

    const filteredMatches = matches.filter((m) => {
        if (activeFilter === "upcoming") {
            return isUpcomingMatch(m, now);
        }

        if (activeFilter === "past") {
            return isPastMatch(m, now);
        }

        if (activeFilter === "pending") return m.status === "pending";

        return true; // "all"
    });

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-5">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-[var(--accent-gold)]" />
                    </div>
                    <div>
                        <h1 className="font-outfit text-[20px] font-bold text-[var(--content-primary)] leading-tight">My Matches</h1>
                        <p className="text-[12px] text-[var(--content-muted)]">Track your games</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCreateOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-gold font-bold text-sm transition-all"
                >
                    {isCreateOpen ? (
                        <><X className="w-4 h-4" /> Close</>
                    ) : (
                        <><Plus className="w-4 h-4" /> Create Match</>
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
                                className={`relative shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all ${
                                    activeFilter === f.key
                                        ? "bg-[var(--accent-green)] text-white shadow-glow-green"
                                        : "bg-[var(--surface-inset)] text-[var(--content-muted)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:text-[var(--content-primary)]"
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
                                <div className="w-16 h-16 rounded-full bg-[var(--surface-inset)] flex items-center justify-center mb-4 animate-float">
                                    <Trophy className="w-7 h-7 text-[var(--border-default)]" />
                                </div>
                                <p className="text-[var(--content-secondary)] font-semibold">No matches here</p>
                                <p className="text-[var(--content-muted)] text-[13px] mt-1">
                                    {activeFilter === "pending"
                                        ? "No pending invites. When other players invite you to a match, it will appear here."
                                        : "Create one with the button above!"}
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
