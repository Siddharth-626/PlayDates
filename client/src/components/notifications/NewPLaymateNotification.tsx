// components/Notifications/PlaymateRequestNotification.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles, BadgeCheck, XCircle } from "lucide-react";
import { PlayerProfile } from "@/utils/TYPE";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { NotificationsType } from "@/utils/TYPE";



type PlaymateRequestNotificationProps =  {
    note: any;
    onRespond: (accepted: boolean, note: NotificationsType) => void;
}

const confettiVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
};

const PlaymateRequestNotification: React.FC<PlaymateRequestNotificationProps> = ({
    note,
    onRespond,
}) => {
    const [playerInfo, setPlayerInfo] = useState<PlayerProfile | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            const data = await FetchPlayerProfile({ userUid: note.fromUserUid, profileId: note.fromProfileId });
            setPlayerInfo(data);
        };
        fetchPlayers();
    }, [note]);

    if (note.type !== "playmates request" || !playerInfo) return null;
    const isResponded = note.status !== "pending";

    const handleAccept = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
        onRespond(true, note);
        note.isRead = true;
    };

    const handleReject = () => {
        onRespond(false, note);
        note.isRead = true;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className={`relative flex justify-between border rounded-2xl p-5 shadow-xl w-full gap-5 items-center overflow-hidden ${
                isResponded
                    ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
                    : "bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700"
            }`}
        >
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        variants={confettiVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Sparkles size={64} className="text-yellow-400 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="relative">
                {playerInfo?.photoUrl ? (
                    <img
                        src={playerInfo.photoUrl}
                        alt={playerInfo.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-green-400 shadow-lg"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-400">
                        <User size={36} className="text-green-500" />
                    </div>
                )}
                <BadgeCheck className="absolute -bottom-2 -right-2 text-green-500 bg-white rounded-full p-0.5 shadow" size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    {playerInfo.name}
                </h3>
                <p className="text-md text-green-700 dark:text-green-300 mb-1 font-medium flex items-center gap-1">
                    <User size={16} /> Wants to be your Playmate!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <Sparkles size={15} className="text-yellow-400" /> Skill: <span className="font-semibold ml-1">{playerInfo.skill}</span>
                </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[110px]">
                {isResponded ? (
                    <span className={`text-sm font-semibold px-4 py-2 rounded-xl text-center ${
                        note.status === "accepted"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    }`}>
                        {note.status === "accepted" ? "Accepted" : "Rejected"}
                    </span>
                ) : (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 2px 8px #22c55e44" }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-xl font-semibold shadow transition-all"
                            onClick={handleAccept}
                        >
                            <BadgeCheck size={18} /> Accept
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 2px 8px #ef444444" }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-xl font-semibold shadow transition-all"
                            onClick={handleReject}
                        >
                            <XCircle size={18} /> Reject
                        </motion.button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default PlaymateRequestNotification;
