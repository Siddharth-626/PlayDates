import { useState } from "react";
import { PlaymatePicker } from "../commonComponents/Players/PlayerSelector";
import { Player } from "@/utils/TYPE";
import toast from "react-hot-toast";
import { createChat } from "@/utils/chat/CreateChat";
import { useProfile } from "@/context/profileContext";
import { Users, PlusCircle, XCircle, MessageSquare } from "lucide-react";

export const CreateChatPopup = ({ OnClose }: { OnClose: () => void }) => {
    const { selectedProfile } = useProfile();
    const [players, setPlayers] = useState<any[]>([]);

    const handleCreate = () => {
        if (players.length === 0) {
            toast.error("Please select at least one playmate");
            return;
        }

        players.map(async (player) => {
            await createChat(
                selectedProfile?.userUid,
                selectedProfile?.id,
                player.userUid,
                player.profileId
            );
        });

        toast.success("Chats created successfully 🎾");
        setPlayers([]);
        OnClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
            <div className="w-full max-w-xl rounded-2xl  bg-white dark:bg-gray-900 shadow-2xl border border-green-300 dark:border-green-700 flex flex-col max-h-[90vh] animate-fade-in-down">

                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-800/30">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                        <h2 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300">
                            Create a New Chat
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
                <div className="flex-1 px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Users className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">Players</span>
                    </div>

                    {/* Player Picker */}
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

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                        onClick={() => setPlayers([])}
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
                        Create Chat
                    </button>
                </div>
            </div>
        </div>
    );
};
