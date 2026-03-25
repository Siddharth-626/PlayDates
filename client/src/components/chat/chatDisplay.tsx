"use client";

import { useEffect, useRef, useState } from "react";
import { listenToMessages } from "@/utils/chat/listenToMessages";
import { sendMessage } from "@/utils/chat/sendMessage";
import { useProfile } from "@/context/profileContext";
import { motion } from "framer-motion";
import { handleMessageSeen } from "@/utils/chat/handleMessageSeen";
import { ChevronLeft, Send, CheckCheck, Edit, MessageCircle } from "lucide-react";
import { EditGroupPopup } from "./group/EditGroup";
import { updateChat } from "@/utils/chat/upadteChat";

type Props = {
    chatDisplayData: any; // { name, players, photoUrl?, type }
    OnClose: () => void;
    isDesktop: boolean;
};

// Group messages by date for date separators (item 33)
function formatDateLabel(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (msgDay.getTime() === today.getTime()) return "Today";
    if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export const ChatDisplay = ({ chatDisplayData, isDesktop, OnClose }: Props) => {
    const { selectedProfile } = useProfile();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { chatId } = chatDisplayData;

    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = listenToMessages(chatId, (msgs) => {
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    // Build messages with date separators (item 33)
    const messagesWithSeparators: Array<{ type: "message" | "separator"; data: any; label?: string }> = [];
    let lastDateLabel = "";
    for (const msg of messages) {
        const ts = msg.createdAt?.toDate ? msg.createdAt.toDate() : null;
        const label = ts ? formatDateLabel(ts) : "";
        if (label && label !== lastDateLabel) {
            messagesWithSeparators.push({ type: "separator", data: null, label });
            lastDateLabel = label;
        }
        messagesWithSeparators.push({ type: "message", data: msg });
    }

    return (
        <div className="flex flex-col flex-1 h-screen bg-[var(--surface-base)]">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] shrink-0">
                <div className="flex items-center gap-3">
                    {!isDesktop && (
                        <button onClick={OnClose} className="p-1 rounded-lg hover:bg-[var(--surface-inset)] transition-colors" aria-label="Back">
                            <ChevronLeft className="w-5 h-5 text-[var(--accent-green)]" />
                        </button>
                    )}

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--accent-green)]/40 bg-[var(--surface-inset)] flex items-center justify-center shrink-0">
                        {type !== "1-1" ? (
                            <div className="flex -space-x-2 p-1">
                                {players?.slice(0, 2).map((p: any, idx: number) => (
                                    p.photoUrl ? (
                                        <img
                                            key={p.userUid || idx}
                                            src={p.photoUrl}
                                            alt={p.name}
                                            className="w-5 h-5 rounded-full object-cover border border-[var(--surface-inset)]"
                                        />
                                    ) : (
                                        <div key={idx} className="w-5 h-5 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                                            <span className="text-[9px] font-bold text-[var(--accent-green)]">{p.name?.[0]}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : chatDisplayData.photoUrl ? (
                            <img src={chatDisplayData.photoUrl} alt={chatDisplayData.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-base font-bold text-[var(--accent-green)]">
                                {chatDisplayData.name?.[0]?.toUpperCase() ?? "P"}
                            </span>
                        )}
                    </div>

                    {/* Name + subtitle */}
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[14px] text-[var(--content-primary)] truncate max-w-[200px]">
                            {chatDisplayData?.name}
                        </span>
                        {type !== "1-1" && (
                            <span className="text-[11px] text-[var(--content-muted)] truncate max-w-[200px]">
                                {players?.map((p: any) => p.name).slice(0, 3).join(", ")}
                                {players?.length > 3 && "…"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Edit group button */}
                {chatDisplayData.type === "group" && (
                    <button
                        onClick={() => setShowEditPopup(true)}
                        className="p-1.5 rounded-lg hover:bg-[var(--surface-inset)] transition-colors text-[var(--content-muted)] hover:text-[var(--accent-green)]"
                        aria-label="Edit group"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Messages ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                {messagesWithSeparators.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-16 gap-3">
                        <div className="w-14 h-14 rounded-full bg-[var(--surface-inset)] flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-[var(--content-muted)]" />
                        </div>
                        <p className="font-semibold text-[var(--content-secondary)]">Start the conversation</p>
                        <p className="text-[13px] text-[var(--content-muted)]">
                            Say hello to your {type === "group" ? "group" : "playmate"}
                        </p>
                    </div>
                ) : (
                    messagesWithSeparators.map((item, idx) => {
                        if (item.type === "separator") {
                            return (
                                <div key={`sep-${idx}`} className="flex items-center gap-3 py-3">
                                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                                    <span className="text-[11px] font-medium text-[var(--content-muted)] px-2 py-0.5 rounded-full bg-[var(--surface-inset)] whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                                </div>
                            );
                        }

                        const msg = item.data;
                        const isMe = msg.senderUid === selectedProfile?.userUid && msg.senderProfileId === selectedProfile?.id;
                        const isSeen = msg.seen;
                        const timeStr = msg.createdAt?.toDate
                            ? msg.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "";

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
                            >
                                {/* Other person's message */}
                                {!isMe && (
                                    <div className="flex items-end gap-2 max-w-[75%]">
                                        {msg.senderPhotoUrl ? (
                                            <img
                                                src={msg.senderPhotoUrl}
                                                alt={msg.senderName}
                                                className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)] shrink-0 mb-0.5"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-[var(--surface-inset)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 mb-0.5">
                                                <span className="text-[10px] font-bold text-[var(--content-secondary)]">
                                                    {msg.senderName?.[0]?.toUpperCase() ?? "P"}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <div className="px-3 py-2 rounded-2xl rounded-bl-none text-sm break-words bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                                                {/* item 34: sender name in neutral muted color, not green */}
                                                <p className="text-[11px] font-semibold text-[var(--content-muted)] mb-0.5">
                                                    {msg.senderName}
                                                </p>
                                                <p className="text-[var(--content-primary)]">{msg.text}</p>
                                            </div>
                                            {timeStr && (
                                                <span className="text-[10px] text-[var(--content-muted)] mt-0.5 ml-1">{timeStr}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* My message */}
                                {isMe && (
                                    <div className="flex flex-col items-end max-w-[75%]">
                                        <div className="px-3 py-2 rounded-2xl rounded-br-none text-sm break-words bg-[var(--accent-green)] text-white">
                                            <p>{msg.text}</p>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5 mr-1">
                                            {timeStr && (
                                                <span className="text-[10px] text-[var(--content-muted)]">{timeStr}</span>
                                            )}
                                            <CheckCheck
                                                size={12}
                                                className={isSeen ? "text-blue-400" : "text-[var(--content-muted)]"}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input ──────────────────────────────────────────────── */}
            <div className={`${!isDesktop ? "pb-[72px]" : ""} shrink-0 sticky bottom-0 px-3 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center gap-2`}>
                <input
                    type="text"
                    placeholder="Type a message…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-[var(--surface-inset)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm outline-none text-[var(--content-primary)] placeholder:text-[var(--content-muted)] focus:border-[var(--accent-green)]/50 transition-colors"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-[var(--accent-green)] hover:opacity-90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                    aria-label="Send message"
                >
                    <Send className="w-4 h-4" />
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
        </div>
    );
};
