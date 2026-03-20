"use client";
import { usePlaymates } from "@/context/playmatesContext";
import { PlayerProfile } from "@/utils/TYPE";
import { ChatPersonCard } from "./Person/ChatPresonCard";
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ChatDisplay } from "./chatDisplay";
import { useProfile } from "@/context/profileContext";
import { listenToChats } from "@/utils/chat/listenToChats";
import { CreateChatPopup } from "./chatCreater";
import Link from "next/link";
import ChatListItem from "./group/ChatGroupCard";
import { useChatDisplayData } from "@/context/chatDisplayDataContext";

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
        const unsubscribe = listenToChats(selectedProfile?.userUid, selectedProfile?.id, (chat) => {
            setChats(chat)
        })

        return unsubscribe;
    }, [selectedProfile?.userUid, selectedProfile?.id, playmates])


    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1000);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!playmates) return null;

    const OnChatSelect = async (chat: any) => {
        if (!isDesktop) {
            setIsSideBarOpen(false);
        }
        setChatDisplayData({
            chatId: chat.id,
            name: chat.groupName || "Match Chat",
            players: chat.participants,
            photoUrl: "",
            type: "group"
        })
    };
    const OnPersonClick = async (player: PlayerProfile, id: string) => {
        if (!isDesktop) {
            setIsSideBarOpen(false);
        }
        setSelectedPerson(player);
        setChatDisplayData({
            chatId: id,
            name: player?.name,
            photoUrl: player.photoUrl,
            userUid: player.userUid,
            id: player.id,
            type:"1-1"
        })
    };

    const filterdChats = chats?.filter((chat) => (
        chat.participants?.some((person: any) => (
            person.name.toLowerCase().includes(search.toLowerCase())
        )) ||
        chat?.lastMessage?.text?.toLowerCase().includes(search.toLowerCase())
    ))
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 rounded-2xl">

            {(isDesktop || isSideBarOpen) && (<div className="flex flex-col w-full max-w-sm h-screen bg-slate-200 dark:bg-slate-700 rounded-s-xl">

                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Chats
                    </h1>
                    <div className="flex items-center gap-3">
                        <PencilSquareIcon className="w-7 h-7 text-gray-500 dark:text-gray-300 cursor-pointer" onClick={() => setIsChatCreaterOpen(!isChatCreaterOpen)} />
                        <Link href="/">
                            <button className="text-red-600 text-sm px-2 py-1 bg-transparent hover:bg-red-600 border border-red-600 rounded-lg hover:text-white ">Exit</button>
                        </Link>

                    </div>
                    {isChatCreaterOpen && (
                        <div>
                            <CreateChatPopup OnClose={() => setIsChatCreaterOpen(false)} />
                        </div>
                    )}
                </div>

                <div className="px-3 py-2">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search or start a new chat"
                            className="ml-2 flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto">
                    {filterdChats?.slice(0, 15).map((chat) => {
                        return chat.type == "1-1" ? <ChatPersonCard
                            selectedPerson={selectedPerson}
                            onClick={OnPersonClick}
                            key={chat.id}
                            chat={chat}
                        /> :
                            <ChatListItem chat={chat} onClick={OnChatSelect} key={chat.id} />
                    })}
                </div>
                {chats.length == 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-300 space-y-3">
                        <p className="text-sm">No chats yet.</p>
                        <p className="text-sm">You can create chats with your playmates by clicking this icon:</p>
                        <PencilSquareIcon
                            className="w-8 h-8 text-green-600 dark:text-green-400 cursor-pointer hover:scale-110 transition"
                            onClick={() => setIsChatCreaterOpen(!isChatCreaterOpen)}
                        />
                    </div>
                )}
            </div>)}

            {(isDesktop || !isSideBarOpen) ? (
                <div className="flex-1 flex items-center justify-center">
                    {chatDisplayData ? (
                        <ChatDisplay
                            OnClose={() => setIsSideBarOpen(true)}
                            isDesktop={isDesktop}
                            chatDisplayData={chatDisplayData}
                        />
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-300 space-y-3">
                            <p className="text-lg font-semibold">No chat selected</p>
                            <p className="text-sm">Pick a chat from the sidebar or create a new one.</p>
                            <PencilSquareIcon
                                className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 cursor-pointer hover:scale-110 transition"
                                onClick={() => setIsChatCreaterOpen(true)}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
