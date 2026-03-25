import { useAuth } from "@/context/authContext";
import { useChatDisplayData } from "@/context/chatDisplayDataContext";
import { useProfile } from "@/context/profileContext";
import { createChat } from "@/utils/chat/CreateChat";
import { PlayerProfile } from "@/utils/TYPE";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ActionButtons({
  onAdd,
  player,
}: {
  onAdd: () => void;
  player: PlayerProfile;
}) {
  const [btnStatus, setBtnStatus] = useState("");
  const { selectedProfile } = useProfile();
  const { user } = useAuth();
  const router = useRouter();
  const { setChatDisplayData } = useChatDisplayData();

  const onAddAsPlaymateClick = (status: string) => {
    try {
      if (!user?.uid || !selectedProfile?.id) return;
      const isPlaymate = player.playmates.some(
        (p) => p.userUid === user?.uid && p.profileId === selectedProfile?.id
      );
      if (isPlaymate) {
        setBtnStatus("accepted");
      } else {
        setBtnStatus(status);
      }
    } catch (error) {
      // silently fail
    }
  };

  const handleChatClick = async () => {
    const players = [
      {
        userUid: selectedProfile?.userUid,
        profileId: selectedProfile?.id,
        name: selectedProfile?.name,
        photoUrl: selectedProfile?.photoUrl,
      },
      {
        userUid: player?.userUid,
        profileId: player?.id,
        name: player?.name,
        photoUrl: player?.photoUrl,
      },
    ];

    const chatId = await createChat(players, "1-1", "", "");
    if (!chatId) return;

    setChatDisplayData({
      chatId: chatId,
      userUid: player.userUid,
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      type: "1-1",
    });
    router.push("/chats");
  };

  useEffect(() => {
    onAddAsPlaymateClick("");
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 w-full">
      {btnStatus == "" && (
        <button
          onClick={() => {
            onAdd();
            onAddAsPlaymateClick("pending");
          }}
          className="btn-primary flex-1"
        >
          Add as Playmate
        </button>
      )}

      {btnStatus == "pending" && (
        <button className="btn-secondary flex-1 cursor-default opacity-70">
          Request Sent
        </button>
      )}

      <button
        onClick={handleChatClick}
        className="btn-secondary flex-1"
      >
        Chat
      </button>
    </div>
  );
}
