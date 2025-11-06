import React from "react";

type ChatProps = {
    chat: any
    onClick: (chat: any) => void;
    setChatId: (chatId: string) => void
};

const ChatListItem: React.FC<ChatProps> = ({ chat, onClick, setChatId }) => {
    const { type, groupName, participants, lastMessage, unSeenMessages } = chat;

    const name =
        type === "group"
            ? groupName || "Unnamed Group"
            : groupName || "Match Chat";

    const lastMessageText = lastMessage?.text || "";
    const lastMessageTime = lastMessage?.createdAt?.toDate
        ? lastMessage?.createdAt
            .toDate()
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

    return (
        <div
            className="flex items-center px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition rounded-xl"
            onClick={() => { onClick(chat); setChatId(chat.id) }}
        >
            {/* Avatar / Icon */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-md flex items-center justify-center bg-green-100 dark:bg-green-700">
                    <div className="flex -space-x-2">
                        {participants.slice(0, 2).map((p: any, idx: number) => (
                            <img
                                key={idx}
                                src={p.photoUrl}
                                alt={`${p.name}'s profile`}
                                className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-green-700"
                            />
                        ))}
                        {participants.length > 2 && (
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center border-2 border-white dark:border-green-700">
                                +{participants.length - 2}
                            </div>
                        )}
                    </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 ml-3 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                        {name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {lastMessageTime}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {lastMessageText}
                    </span>
                    {unSeenMessages && unSeenMessages > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-2 flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full">
                            {unSeenMessages}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
