"use client";
import { usePlaymates } from "@/context/playmatesContext";
import { PlayerProfile } from "@/utils/TYPE";
import { ChatPersonCard } from "./Person/ChatPresonCard";
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ChatDisplay } from "./chatDisplay";
import { useProfile } from "@/context/profileContext";
import { listenToChats } from "@/utils/chat/listenToChats";
import { CreateChatPopup } from "./chatCreater";
import ChatListItem from "./group/ChatGroupCard";
import { useChatDisplayData } from "@/context/chatDisplayDataContext";
import { format } from "date-fns";

// Formats a "Match Chat" name to include court/date context if available
function formatChatName(chat: any): string {
    if (chat.type === "1-1") return chat.groupName || "Chat";
    const base = chat.groupName || "Match Chat";
    // If it already has context embedded (contains ·), return as-is
    if (base.includes("·")) return base;
    // Try to build context from participants or metadata
    const date = chat.matchDate
        ? (() => {
              try {
                  const d = chat.matchDate?.toDate?.() ?? new Date(chat.matchDate);
                  return format(d, "MMM d");
              } catch {
                  return null;
              }
          })()
        : null;
    const court = chat.courtName ?? null;
    const extra = [court, date].filter(Boolean).join(" · ");
    return extra ? `${base} · ${extra}` : base;
}

export const ChatDashBoard = () => {
    const { selectedProfile } = useProfile();
    const { playmates } = usePlaymates();
    const [chats, setChats] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [isChatCreaterOpen, setIsChatCreaterOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<PlayerProfile | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    const { chatDisplayData, setChatDisplayData } = useChatDisplayData();

    useEffect(() => {
        if (!playmates) return;
        const unsubscribe = listenToChats(
            selectedProfile?.userUid,
            selectedProfile?.id,
            (chat) => setChats(chat)
        );
        return unsubscribe;
    }, [selectedProfile?.userUid, selectedProfile?.id, playmates]);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1000);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!playmates) return null;

    const onChatSelect = (chat: any) => {
        if (!isDesktop) setIsSideBarOpen(false);
        setChatDisplayData({
            chatId: chat.id,
            name: formatChatName(chat),
            players: chat.participants,
            photoUrl: "",
            type: "group",
        });
    };

    const onPersonClick = (player: PlayerProfile, id: string) => {
        if (!isDesktop) setIsSideBarOpen(false);
        setSelectedPerson(player);
        setChatDisplayData({
            chatId: id,
            name: player?.name,
            photoUrl: player.photoUrl,
            userUid: player.userUid,
            id: player.id,
            type: "1-1",
        });
    };

    const filteredChats = chats?.filter(
        (chat) =>
            chat.participants?.some((p: any) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            ) || chat?.lastMessage?.text?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#0d1b2a]">
            {/* ── Chat sidebar ──────────────────────────────────────── */}
            {(isDesktop || isSideBarOpen) && (
                <div className="flex flex-col w-full max-w-sm h-screen bg-[#0a1628] border-r border-[#1e3040]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 h-14 border-b border-[#1e3040] shrink-0">
                        <h1 className="text-base font-bold text-white">Chats</h1>
                        <button
                            onClick={() => setIsChatCreaterOpen(!isChatCreaterOpen)}
                            className="p-2 rounded-xl hover:bg-[#1a2a3a] transition-colors"
                            aria-label="New chat"
                        >
                            <PencilSquareIcon className="w-5 h-5 text-[#94a3b8]" />
                        </button>

                        {isChatCreaterOpen && (
                            <CreateChatPopup OnClose={() => setIsChatCreaterOpen(false)} />
                        )}
                    </div>

                    {/* Search */}
                    <div className="px-3 py-3 shrink-0">
                        <div className="flex items-center bg-[#1a2a3a] border border-[#2d4a3e] rounded-xl px-3 py-2.5 gap-2">
                            <MagnifyingGlassIcon className="w-4 h-4 text-[#22c55e] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#6b7280]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Chat list */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats?.slice(0, 15).map((chat) =>
                            chat.type === "1-1" ? (
                                <ChatPersonCard
                                    selectedPerson={selectedPerson}
                                    onClick={onPersonClick}
                                    key={chat.id}
                                    chat={chat}
                                />
                            ) : (
                                <ChatListItem
                                    chat={{ ...chat, groupName: formatChatName(chat) }}
                                    onClick={onChatSelect}
                                    key={chat.id}
                                />
                            )
                        )}

                        {chats.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 space-y-3">
                                <PencilSquareIcon className="w-8 h-8 text-[#22c55e]" />
                                <p className="text-sm text-[#94a3b8]">No chats yet.</p>
                                <p className="text-sm text-[#6b7280]">
                                    Start a conversation with your playmates.
                                </p>
                                <button
                                    onClick={() => setIsChatCreaterOpen(true)}
                                    className="mt-2 px-4 py-2 rounded-xl bg-[#22c55e] text-black text-sm font-bold"
                                >
                                    New Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Chat display area ─────────────────────────────────── */}
            {(isDesktop || !isSideBarOpen) && (
                <div className="flex-1 flex items-center justify-center bg-[#0d1b2a]">
                    {chatDisplayData ? (
                        <ChatDisplay
                            OnClose={() => setIsSideBarOpen(true)}
                            isDesktop={isDesktop}
                            chatDisplayData={chatDisplayData}
                        />
                    ) : (
                        <div className="text-center space-y-3 px-8">
                            <div className="w-16 h-16 rounded-full bg-[#1a2a3a] flex items-center justify-center mx-auto">
                                <PencilSquareIcon className="w-7 h-7 text-[#22c55e]" />
                            </div>
                            <p className="text-white font-semibold text-lg">No chat selected</p>
                            <p className="text-sm text-[#6b7280]">
                                Pick a chat from the list or start a new one.
                            </p>
                            <button
                                onClick={() => setIsChatCreaterOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-[#22c55e] text-black text-sm font-bold"
                            >
                                New Chat
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
