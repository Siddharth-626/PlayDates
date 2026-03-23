import { motion } from "framer-motion";
import {
    Bell,
    User,
    Users,
    Calendar,
    MapPin,
    Trophy,
    ChevronRight,
    MessageCircle,
    Search,
    Calendar1,
    Star,
} from "lucide-react";
import { useProfile } from "@/context/profileContext";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import { usePlaymates } from "@/context/playmatesContext";
import { useMatchs } from "@/context/matchContext";
import { useAuth } from "@/context/authContext";

const SKILL_LABELS: Record<string, string> = {
    "1.0 - 1.5": "Beginner",
    "2.0 - 2.5": "Novice",
    "3.0 - 3.5": "Intermediate",
    "4.0 - 4.5": "Advanced",
    "5.0": "Expert",
};

export default function HomeTab({ setTab }: { setTab: (tab: string) => void }) {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const { matches } = useMatchs();
    const { notifications } = useFetchNotifications({
        userUid: user?.uid,
        profileId: selectedProfile?.id,
    });
    const { playmates } = usePlaymates();

    const unreadNotifications = notifications?.filter((n) => !n.isRead).length || 0;
    const upcomingMatches = matches?.filter((m) => m.status === "accepted").length || 0;
    const pendingMatches = matches?.filter((m) => m.status === "pending").length || 0;
    const playmatesLength = playmates?.length || 0;

    const countTiles = [
        {
            label: "Playmates",
            value: playmatesLength,
            icon: <Users className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("My Playmates"),
            urgent: false,
        },
        {
            label: "Upcoming Matches",
            value: upcomingMatches,
            icon: <Calendar className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("My Matches"),
            urgent: false,
        },
        {
            label: "Pending Matches",
            value: pendingMatches,
            icon: <Trophy className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("My Matches"),
            urgent: pendingMatches > 0,
        },
        {
            label: "Notifications",
            value: unreadNotifications,
            icon: <Bell className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("Notifications"),
            urgent: unreadNotifications > 0,
        },
    ];

    const navTiles = [
        {
            label: "Find Players",
            icon: <Search className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("Find Players"),
        },
        {
            label: "Messages",
            icon: <MessageCircle className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("Messages"),
        },
        {
            label: "Profile",
            icon: <User className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("Player Profile"),
        },
        {
            label: "Find Courts",
            icon: <MapPin className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("Find Courts"),
        },
        {
            label: "My Calendar",
            icon: <Calendar1 className="w-6 h-6 text-[#22c55e]" />,
            onClick: () => setTab("My Calendar"),
        },
    ];

    const skillLabel = selectedProfile?.skill
        ? SKILL_LABELS[selectedProfile.skill] || selectedProfile.skill
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full mx-auto p-4 md:p-6 space-y-5 bg-[#0d1b2a] min-h-screen"
        >
            {/* ── Profile Card ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between bg-[#111f2e] border border-[#1e3040] border-l-4 border-l-[#22c55e] rounded-2xl p-4 shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        {selectedProfile?.photoUrl ? (
                            <img
                                src={selectedProfile.photoUrl}
                                className="w-16 h-16 rounded-full border-2 border-[#22c55e] object-cover shadow"
                                alt={selectedProfile.name}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full border-2 border-[#22c55e] bg-[#1a2a3a] flex items-center justify-center">
                                <User className="w-7 h-7 text-[#22c55e]" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white leading-tight">
                            {selectedProfile?.name || "Player"}
                        </div>
                        <div className="text-sm text-[#94a3b8] mt-0.5">
                            {selectedProfile?.age && selectedProfile?.gender
                                ? `${selectedProfile.age} · ${selectedProfile.gender}`
                                : ""}
                        </div>
                        {skillLabel && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <Star className="w-3.5 h-3.5 text-[#22c55e]" />
                                <span className="text-xs font-semibold text-[#22c55e]">
                                    {skillLabel}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setTab("Player Profile")}
                    className="p-2 rounded-xl hover:bg-[#1a2a3a] transition-colors"
                    aria-label="Edit profile"
                >
                    <ChevronRight className="w-5 h-5 text-[#22c55e]" />
                </button>
            </motion.div>

            {/* ── Count tiles (Playmates, Upcoming, Pending, Notifications) ── */}
            <div>
                <h2 className="text-[13px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-3 px-1">
                    Overview
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {countTiles.map((tile, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={tile.onClick}
                            className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                                tile.urgent
                                    ? "bg-[#1e3040] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                                    : "bg-[#111f2e] border-[#1e3040] hover:border-[#22c55e]"
                            }`}
                        >
                            {tile.urgent && (
                                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                            )}
                            {tile.icon}
                            <div className="mt-3 text-3xl font-bold text-[#22c55e] leading-none">
                                {tile.value}
                            </div>
                            <div className="mt-1 text-[13px] text-[#94a3b8] font-medium">
                                {tile.label}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ── Nav tiles (Find Players, Messages, etc.) ──────────────── */}
            <div>
                <h2 className="text-[13px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-3 px-1">
                    Quick Access
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {navTiles.map((tile, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + idx * 0.04 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={tile.onClick}
                            className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#111f2e] border border-[#1e3040] hover:border-[#22c55e] transition-all"
                        >
                            {tile.icon}
                            <span className="text-[13px] font-medium text-white">
                                {tile.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
