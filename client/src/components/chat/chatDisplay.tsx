"use client";

import { useEffect, useState } from "react";
import { listenToMessages } from "@/utils/chat/listenToMessages";
import { sendMessage } from "@/utils/chat/sendMessage";
import { PlayerProfile } from "@/utils/TYPE";
import { ArrowBigLeft, Check, CheckCheck, ChevronLeft, LogOut, Send } from "lucide-react";
import { useProfile } from "@/context/profileContext";
import { motion } from "framer-motion";
import { handleMessageSeen } from "@/utils/chat/handleMessageSeen";

type Props = {
    selectedPerson: PlayerProfile;
    chatId: string;
    OnClose: () => void
    isDesktop: boolean
};

export const ChatDisplay = ({ selectedPerson, chatId, isDesktop, OnClose }: Props) => {
    const { selectedProfile } = useProfile(); // current user profile
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = listenToMessages(chatId, (msgs) => {
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedProfile) return;

        await sendMessage(chatId, input, selectedProfile.userUid, selectedProfile.id);
        setInput("");
    };

    useEffect(() => {
        {
            messages.map((msg) => {
                const isMe = msg.senderUid === selectedProfile?.userUid;
                if (!isMe) {
                    handleMessageSeen(chatId, msg.id);
                }

            })
        }
    }, [messages])

    return (
        <div className="flex flex-col flex-1 h-screen bg-gray-50 dark:bg-gray-800">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                {!isDesktop && <div onClick={OnClose}><ChevronLeft size={1} className="w-5 h-5 text-green-600" /></div>}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 shadow">
                    {selectedPerson.photoUrl ? (
                        <img
                            src={selectedPerson.photoUrl}
                            alt={`${selectedPerson.name}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-semibold">
                            {selectedPerson.name?.[0]?.toUpperCase() ?? "P"}
                        </div>
                    )}
                </div>
                <div className="ml-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                        {selectedPerson?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Online
                    </div>
                </div>
            </div>


            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-cover">
                {messages.map((msg) => {
                    const isMe = msg.senderUid === selectedProfile?.userUid;
                    const isSeen = msg.seen;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow relative ${isMe
                                    ? "bg-green-500 text-white rounded-br-none"
                                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}

                                {/* Time + ticks row */}
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-200 dark:text-gray-400">
                                        {msg.createdAt?.toDate
                                            ? msg.createdAt.toDate().toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : ""}
                                    </span>

                                    {isMe && (
                                        <div className="flex gap-[2px]">
                                            <CheckCheck
                                                size={14}
                                                className={`${isSeen ? "text-blue-500" : "text-gray-300"
                                                    } -mr-2`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>


            <div className="sticky bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none text-gray-800 dark:text-gray-200"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-3 bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
