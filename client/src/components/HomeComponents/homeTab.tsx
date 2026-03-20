import { motion } from "framer-motion";
import {
    Bell,
    User,
    Users,
    Calendar,
    MapPin,
    Trophy,
    ChevronRight,
    Send,
    Search,
    Calendar1,
} from "lucide-react";
import { useProfile } from "@/context/profileContext";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import { usePlaymates } from "@/context/playmatesContext";
import { useMatchs } from "@/context/matchContext";
import { useAuth } from "@/context/authContext";

export default function HomeTab({ setTab }: { setTab: (tab: string) => void }) {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const { matches } = useMatchs();
    const { notifications } = useFetchNotifications({
        userUid: user?.uid,
        profileId: selectedProfile?.id,
    });
    const { playmates } = usePlaymates();

    const unreadNotifications =
        notifications?.filter((n) => !n.isRead).length || 0;
    const upcomingMatches = matches?.filter((m) => m.status === "accepted")
        .length || 0;
    const pendingMatches =
        matches?.filter((m) => m.status === "pending").length || 0;
    const playmatesLength = playmates ? playmates.length : 0;

    const items = [
        {
            label: "Playmates",
            value: playmatesLength || "—",
            icon: <Users className="w-6 h-6" />,
            color: "from-pink-400 to-pink-600",
            onClick: () => setTab("My Playmates"),
        },
        {
            label: "Upcoming Matches",
            value: upcomingMatches,
            icon: <Calendar className="w-6 h-6" />,
            color: "from-blue-400 to-blue-600",
            onClick: () => setTab("My Matches"),
        },
        {
            label: "Pending Matches",
            value: pendingMatches,
            icon: <Trophy className="w-6 h-6" />,
            color: "from-yellow-400 to-yellow-600",
            onClick: () => setTab("My Matches"),
        },
        {
            label: "Notifications",
            value: unreadNotifications,
            icon: <Bell className="w-6 h-6" />,
            color: "from-red-400 to-red-600",
            onClick: () => setTab("Notifications"),
        },
        {
            label: "Find Players",
            value: '',
            icon: <Search className="w-6 h-6" />,
            color: "from-orange-400 to-orange-600",
            onClick: () => setTab("Find Players")
        },
        {
            label: "Messages",
            value: "",
            icon: <Send className="w-6 h-6" />,
            color: "from-green-400 to-green-600",
            onClick: () => setTab("Messages"),
        },
        {
            label: "Profile",
            value: "",
            icon: <User className="w-6 h-6" />,
            color: "from-purple-400 to-purple-600",
            onClick: () => setTab("Player Profile"),
        },
        {
            label: "Find Courts",
            value: "",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-indigo-400 to-indigo-600",
            onClick: () => { setTab("Find Courts") },
        },
        {
            label: "My Calender",
            value: "",
            icon: <Calendar1 className="w-6 h-6" />,
            color: "from-green-800 to-green-600",
            onClick: () => { setTab("My Calendar") },
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full mx-auto p-4 md:p-8 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl space-y-6"
        >
            {/* Profile Card */}
            <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-gray-200 to-gray-400  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-4">
                     <div className="w-20 h-20 mx-auto">
                            <img
                                src={selectedProfile?.photoUrl}
                                className="rounded-full border-4 border-green-500 shadow-lg w-full h-full object-cover"
                                alt={selectedProfile?.name}
                            />
                        </div>
                    <div>
                        <div className="text-lg font-bold text-green-800">
                            {selectedProfile?.name || "Player"}
                        </div>
                        <div className="text-sm opacity-90 text-green-800">
                            {selectedProfile?.age} | {selectedProfile?.gender}
                        </div>
                    </div>
                </div>
                <ChevronRight
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => setTab("Player Profile")}
                />
            </div>

            {/* Colorful Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex ${item.value !== "" ? "flex-col" : ""} items-center justify-center rounded-xl shadow-lg text-white cursor-pointer p-4 bg-gradient-to-br ${item.color}`}
                        onClick={item.onClick}
                    >
                        {item.icon}
                        {item.value !== "" && (
                            <div className="text-lg font-bold mt-2">{item.value}</div>
                        )}
                        <div className="ml-2 text-sm opacity-90">{item.label}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
