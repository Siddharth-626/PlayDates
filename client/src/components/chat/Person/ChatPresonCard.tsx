import { useEffect, useState } from "react";
import { useProfile } from "@/context/profileContext";
import { FetchPlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfile";
import { PlayerProfile } from "@/utils/TYPE";
import { Loading } from "@/components/ui/Loading";
import { listenToMessages } from "@/utils/chat/listenToMessages";

type Props = {
    onClick: (player: PlayerProfile) => void;
    selectedPerson: PlayerProfile | null;
    chat: any;
    setChatId: (chatID: string) => void
};

export const ChatPersonCard = ({ chat, setChatId, onClick }: Props) => {
    const { selectedProfile } = useProfile();
    const [player, setPlayer] = useState<PlayerProfile | null>(null);
    const [unSeenMeesages, setUnSeenMessages] = useState(0);
    useEffect(() => {
        const fetchPlayer = async () => {
            if (!selectedProfile) return;

            const userUid =
                chat.participants[1].userUid === selectedProfile.userUid
                    ? chat.participants[0].userUid
                    : chat.participants[1].userUid;

            const profileId =
                chat.participants[1].profileId === selectedProfile.id
                    ? chat.participants[0].profileId
                    : chat.participants[1].profileId;

            const fetchedPlayer = await FetchPlayerProfile({ userUid, profileId });
            setPlayer(fetchedPlayer);
        };

        fetchPlayer();
    }, [chat, selectedProfile]);

    useEffect(() => {
        const unsubscribe = listenToMessages(chat.id, (messages) => {
            const newMessages = messages.filter((msg: any) => msg.seen == false);
            setUnSeenMessages(newMessages.length);
        })

        return () => unsubscribe();
    }, [chat.id])

    if (!player) {
        return (
            <Loading />
        );
    }

    const { photoUrl, name } = player;
    const isMe = chat.lastMessage?.senderUid == selectedProfile?.userUid;
    return (
        <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
            onClick={() => { setChatId(chat.id); onClick(player) }}
        >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 shadow">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${name}'s profile`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-semibold">
                        {name?.[0]?.toUpperCase() ?? "P"}
                    </div>
                )}
            </div>
            {/* Details */}
            <div className="flex-1 ml-3 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                        {name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.lastMessage?.createdAt?.toDate
                            ? chat?.lastMessage?.createdAt.toDate().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {isMe ? "You:" : ""} {chat?.lastMessage?.text}
                    </span>
                    {unSeenMeesages > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-2 flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full">
                            {unSeenMeesages}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
