"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Save } from "lucide-react";
import { PlaymatePicker } from "@/components/commonComponents/Players/PlayerSelector";
import toast from "react-hot-toast";

export const EditGroupPopup = ({ isOpen, onClose, group, onSave, players }: any) => {
    const [groupName, setGroupName] = useState(group?.name || "");
    const [selectedPlayers, setSelectedPlayers] = useState(players);

    const handleSave = () => {
        if (!groupName.trim()) return;
        onSave({ ...group, groupName: groupName, participants: selectedPlayers });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2 sm:px-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 relative max-h-[90vh] overflow-y-auto"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                        >
                            <X size={22} />
                        </button>

                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-5">
                            <Users className="text-green-600 dark:text-green-400" />
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                                Edit Group
                            </h2>
                        </div>

                        {/* Group Name Input */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Group Name
                            </label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Enter group name"
                            />
                        </div>

                        {/* Player Selector */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Add Players
                            </label>
                            <PlaymatePicker
                                type="chat"
                                selected={selectedPlayers}
                                onChange={(players) => setSelectedPlayers(players)}
                                numberOfPlayers={10}
                                isAutoPlayerPickerSelected={false}
                                OnAutoPlayerSelect={() =>
                                    toast.error("Auto-selection is not allowed here")
                                }
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0 mt-6">
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center justify-center space-x-2"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
