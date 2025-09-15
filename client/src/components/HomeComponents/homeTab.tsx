import { motion } from "framer-motion";
import { Bell, User, Users, Calendar, MapPin, Trophy, ChevronRight, Send, } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { useFetchMatches } from "@/hooks/useFetchMatchs";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import { DisplayAvailability } from "../availability/displayAvailability/displayAvailability";
import { usePlaymates } from "@/context/playmatesContext";
import Link from "next/link";

export default function HomeTab({ setTab }: { setTab: (tab: string) => void }) {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const { matches } = useFetchMatches({ userUid: user?.uid, profileId: selectedProfile?.id });
    const { notifications } = useFetchNotifications({ userUid: user?.uid, profileId: selectedProfile?.id });
    const { playmates } = usePlaymates()

    // Summary stats
    const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0;
    const upcomingMatches = matches?.filter(m => m.status === "accepted").length || 0;
    const pendingMatches = matches?.filter(m => m.status === "pending").length || 0;
    const playmatesLength = playmates ? playmates.length : 0
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full  mx-auto p-6 md:p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl backdrop-blur-lg border border-green-200 dark:border-green-700 space-y-6"
        >
            {/* Profile & Notification Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-green-100 via-green-50 to-green-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-4 shadow"
            >
                <div className="flex items-center gap-4">
                    <User className="w-12 h-12 text-green-600 dark:text-green-300" />
                    <div>
                        <div className="text-lg font-bold text-green-800 dark:text-green-200">{selectedProfile?.name || "Player"}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{selectedProfile?.age} | {selectedProfile?.gender}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                        tabIndex={0}
                        aria-label="Notifications"
                    >
                        <Bell className="w-8 h-8 text-green-500 dark:text-green-300" onClick={() => setTab("Notifications")} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-bold shadow">
                                {unreadNotifications}
                            </span>
                        )}
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                        tabIndex={0}
                        aria-label="Notifications"
                    >
                        <Link href="/chat">
                            <Send className="w-8 h-8 text-green-500 dark:text-green-300" />
                        </Link>


                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-semibold"
                        tabIndex={0}
                        aria-label="View Profile"
                        onClick={() => setTab("Player Profile")}
                    >
                        <ChevronRight className="w-4 h-4" />
                        Profile
                    </motion.div>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition"
                >
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => setTab("My Playmates")}>
                        <Users className="w-8 h-8 text-green-500 mb-2" />
                        {playmatesLength != 0 ? (<div className="text-lg font-bold text-green-700 dark:text-green-200">{playmatesLength}</div>) : <p className="text-xl font-bold text-teal-700">Loading...</p>}
                        <div className="text-sm text-gray-500 dark:text-gray-400">Playmates</div>
                    </div>
                    <button className="w-full px-2 py-1 bg-transperent border border-green-400 rounded-full text-sm text-green-700 hover:translate-y-1 hover:bg-green-600 hover:text-white" onClick={() => setTab("Find Players")}>Find Playmates</button>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition"
                >
                    <Calendar className="w-8 h-8 text-green-500 mb-2" />
                    <div className="text-lg font-bold text-green-700 dark:text-green-200">{upcomingMatches}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming Matches</div>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition"
                >
                    <Trophy className="w-8 h-8 text-green-500 mb-2" />
                    <div className="text-lg font-bold text-green-700 dark:text-green-200">{pendingMatches}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pending Matches</div>
                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-4"
            >
                <div className="w-full p-2">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-200 mb-2">Availability</h3>
                    <DisplayAvailability />
                </div>
            </motion.div>
        </motion.div>
    );
}


