"use client";

import { useEffect, useState } from "react";
import { listenToMessages } from "@/utils/chat/listenToMessages";
import { sendMessage } from "@/utils/chat/sendMessage";
import { useProfile } from "@/context/profileContext";
import { motion } from "framer-motion";
import { handleMessageSeen } from "@/utils/chat/handleMessageSeen";
import { ChevronLeft, Send, CheckCheck, Edit } from "lucide-react";
import { EditGroupPopup } from "./group/EditGroup";
import { updateChat } from "@/utils/chat/upadteChat";

type Props = {
    chatDisplayData: any; // { name, players, photoUrl?, type }
    OnClose: () => void;
    isDesktop: boolean;
};

export const ChatDisplay = ({
    chatDisplayData,
    isDesktop,
    OnClose,
}: Props) => {
    const { selectedProfile } = useProfile(); // current user profile
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const { chatId } = chatDisplayData;

    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = listenToMessages(chatId, (msgs) => {
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedProfile) return;

        await sendMessage(
            chatId,
            input,
            selectedProfile.userUid,
            selectedProfile.id,
            selectedProfile?.name,
            selectedProfile.photoUrl
        );
        setInput("");
    };

    useEffect(() => {
        messages.forEach((msg) => {
            const isMe = msg.senderUid === selectedProfile?.userUid && msg.senderProfileId === selectedProfile?.id;
            if (!isMe) {
                handleMessageSeen(chatId, msg.id);
            }
        });
    }, [messages, chatId, selectedProfile]);
    const { players, type } = chatDisplayData;
    return (
        <div className="flex flex-col flex-1 h-screen bg-gray-50 dark:bg-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    {!isDesktop && (
                        <div onClick={OnClose} className="mr-2 cursor-pointer">
                            <ChevronLeft className="w-5 h-5 text-green-600" />
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-md flex items-center justify-center bg-green-100 dark:bg-green-700">
                        {type != "1-1" ? (
                            <div className="flex -space-x-2">
                                {players.slice(1, players.length >= 3 ? 3 : players.length).map((p: any, idx: number) => (
                                    <img
                                        key={p.userUid || p.name}
                                        src={p.photoUrl}
                                        alt={`${p.name}'s profile`}
                                        className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-green-700"
                                    />
                                ))}
                                {players.length > 2 && (
                                    <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center border-2 border-white dark:border-green-700">
                                        +{players.length - 2}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 shadow">
                                {chatDisplayData.photoUrl ? (
                                    <img
                                        src={chatDisplayData.photoUrl}
                                        alt={`${chatDisplayData.name}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-semibold">
                                        {chatDisplayData.name?.[0]?.toUpperCase() ?? "P"}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Group/Player Info */}
                    <div className="ml-3 flex flex-col">
                        <div className="font-medium text-gray-900 dark:text-white">
                            {chatDisplayData?.name}
                        </div>
                        {chatDisplayData.type != "1-1" && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                                {chatDisplayData.players
                                    ?.map((p: any) => p.name)
                                    .slice(0, 3)
                                    .join(", ")}
                                {chatDisplayData.players?.length > 3 && "…"}
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ Edit button at far right */}
                {chatDisplayData.type === "group" && (
                    <button
                        onClick={() => setShowEditPopup(true)}
                        className="ml-auto text-green-500 hover:text-green-600"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                )}
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-cover">
                {messages.map((msg) => {
                    const isMe = msg.senderUid === selectedProfile?.userUid && msg.senderProfileId === selectedProfile?.id;
                    const isSeen = msg.seen;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"} space-y-1`}
                        >
                            {/* Left side for others */}
                            {!isMe && (
                                <div className="flex items-start gap-2">
                                    {/* Profile Picture */}
                                    {msg.senderPhotoUrl ? (
                                        <img
                                            src={msg.senderPhotoUrl}
                                            alt={msg.senderName}
                                            className="w-8 h-8 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                                            {msg.senderName?.[0]?.toUpperCase() ?? "P"}
                                        </div>
                                    )}

                                    {/* Message Bubble with Name + Text */}
                                    <div
                                        className="px-4 py-2 rounded-lg max-w-xs text-sm shadow relative break-words
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                                    >
                                        {/* Sender Name inside bubble */}
                                        <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                                            {msg.senderName}
                                        </div>

                                        {/* Message Text */}
                                        <div>{msg.text}</div>

                                        {/* Time + Seen */}
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-[10px] text-gray-400">
                                                {msg.createdAt?.toDate
                                                    ? msg.createdAt.toDate().toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Right side for Me */}
                            {isMe && (
                                <div className="flex items-start gap-2">
                                    <div
                                        className="px-4 py-2 rounded-lg max-w-xs text-sm shadow relative break-words
            bg-green-800 text-white rounded-br-none"
                                    >
                                        {/* Message Text */}
                                        <div>{msg.text}</div>

                                        {/* Time + Seen */}
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-[10px] text-gray-300">
                                                {msg.createdAt?.toDate
                                                    ? msg.createdAt.toDate().toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""}
                                            </span>
                                            <CheckCheck
                                                size={14}
                                                className={`${isSeen ? "text-blue-500" : "text-gray-300"}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {messages.length === 0 && (
                    <div className="flex flex-col justify-center items-center mt-10">
                        <span className="font-semibold text-2xl text-green-800">
                            Start Chatting Here
                        </span>
                        <span className="font-semibold text-sm text-gray-400">
                            With your {chatDisplayData.type === "group" ? "group" : "playmates"}
                        </span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div
                className={`${!isDesktop && "py-11"
                    } sticky bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900`}
            >
                <input
                    type="text"
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none text-gray-800 dark:text-gray-200"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-3 bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
            <EditGroupPopup
                isOpen={showEditPopup}
                onClose={() => setShowEditPopup(false)}
                group={chatDisplayData}
                onSave={(updatedGroup: any) => {
                    updateChat(chatId, updatedGroup);
                }}
                players={chatDisplayData.players}
            />
        </div >
    );
};
