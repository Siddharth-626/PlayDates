import { useState } from "react";
import { PlaymatePicker } from "../commonComponents/Players/PlayerSelector";
import { useProfile } from "@/context/profileContext";
import toast from "react-hot-toast";
import { createChat } from "@/utils/chat/CreateChat";
import {
    Users,
    PlusCircle,
    XCircle,
    MessageSquare,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export const CreateChatPopup = ({ OnClose }: { OnClose: () => void }) => {
    const { selectedProfile } = useProfile();
    const [players, setPlayers] = useState<any[]>([
        {
            userUid: selectedProfile?.userUid,
            profileId: selectedProfile?.id,
            name: selectedProfile?.name,
            photoUrl: selectedProfile?.photoUrl,
        },
    ]);
    const [groupName, setGroupName] = useState("");

    const handleCreate = async () => {
        if (players.length < 2) {
            toast.error("Select at least one more playmate");
            return;
        }

        const chatType = players.length >= 3 ? "group" : "1-1";
        const finalGroupName =
            chatType === "group" && groupName.trim() === ""
                ? "New Group"
                : groupName;

        await createChat(players, chatType, "", finalGroupName);

        toast.success(
            chatType === "group"
                ? `Group "${finalGroupName}" created 🎾`
                : "Chat created 🎾"
        );
        setPlayers([]);
        setGroupName("");
        OnClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-green-300 dark:border-green-700 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-800/30 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h2 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300">
                            {players.length >= 3 ? "Create Group" : "New Chat"}
                        </h2>
                    </div>
                    <button
                        onClick={OnClose}
                        className="text-gray-400 hover:text-red-500 transition"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-5 py-4 space-y-5 overflow-y-auto">
                    {/* Group name input (only if 3+ players selected) */}
                    {players.length >= 3 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Group Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-slate-100 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    )}

                    {/* Player Picker */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-200">
                            <Users className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">Choose Playmates</span>
                        </div>
                        <PlaymatePicker
                            type="chat"
                            selected={players}
                            onChange={(players) => setPlayers(players)}
                            numberOfPlayers={10}
                            isAutoPlayerPickerSelected={false}
                            OnAutoPlayerSelect={() =>
                                toast.error("Auto-selection is not allowed here")
                            }
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                    <button
                        onClick={() => {
                            setPlayers([]);
                            setGroupName("");
                            OnClose();
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition w-full sm:w-auto"
                    >
                        <XCircle className="w-4 h-4" />
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow w-full sm:w-auto"
                    >
                        <PlusCircle className="w-4 h-4" />
                        {players.length >= 3 ? "Create Group" : "Start Chat"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
