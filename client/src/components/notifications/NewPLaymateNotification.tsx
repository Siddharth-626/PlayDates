// components/Notifications/PlaymateRequestNotification.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayerProfile } from "@/utils/TYPE";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { NotificationsType } from "@/utils/TYPE";



interface PlaymateRequestNotificationProps {
    note: any;
    onRespond: (accepted: boolean, note: NotificationsType) => void;
}

const PlaymateRequestNotification: React.FC<PlaymateRequestNotificationProps> = ({
    note,
    onRespond,
}) => {
    const [playerInfo, setPlayerInfo] = useState<PlayerProfile | null>(null);
    try {
        useEffect(() => {
            const fetchPlayers = async () => {
                const data = await FetchPlayerProfile({ userUid: note.fromUserUid, profileId: note.fromProfileId });
                setPlayerInfo(data);
            }
            fetchPlayers();
        }, [note])
    } catch (error) {
        console.log(error);

    }
    if (note.type !== "playmates request" || note.status !== "pending" || !playerInfo) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-4 shadow-md w-full gap-4 items-center"
        >
            <img
                src={playerInfo?.photoUrl}
                alt={playerInfo.name}
                className="w-14 h-14 rounded-full object-cover border border-green-500"
            />
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{playerInfo.name}</h3>
                <p className="text-md text-gray-500 dark:text-gray-300 mb-1">Wants to be your Playmate</p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Skill: {playerInfo.skill}</p>

            </div>
            <div className="flex gap-2">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-xl transition-all"
                    onClick={() => { onRespond(true, note); note.isRead = true }}
                >
                    Accept
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-xl transition-all"
                    onClick={() => { onRespond(false, note); note.isRead = true }}
                >
                    Reject
                </button>
            </div>
        </motion.div>
    );
};

export default PlaymateRequestNotification;
