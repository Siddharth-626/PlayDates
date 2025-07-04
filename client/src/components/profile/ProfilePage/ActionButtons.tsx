import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { PlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfiles";
import { useEffect, useState } from "react";

export default function ActionButtons({ onAdd, player }: { onAdd: () => void, player: PlayerProfile }) {
  const [btnStatus, setBtnStatus] = useState('');
  const { selectedProfile } = useProfile();
  const { user } = useAuth();
  const onAddAsPlaymateClick = (status:string) => {
    try {
      if (!user?.uid || !selectedProfile?.id) return;
      const isPlaymate = player.playmates.some(
        (p) => p.userUid === user?.uid && p.profileId === selectedProfile?.id
      );
      if(isPlaymate){
        setBtnStatus("accepted")
      }
      else{
        setBtnStatus(status);
      }
    } catch (error) {
      console.log("err while fetching play mate status");
    }
  }

  useEffect(()=>{
      onAddAsPlaymateClick('');
  },[])
  return (
    <div className="flex justify-center gap-4 mt-4">
      {btnStatus != "accepted" ?(<button
        onClick={() => { onAdd(); onAddAsPlaymateClick("pending") }}
        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
      >
        { btnStatus == "pending" ?"Requested":"Add as my playmate"}
      </button>):(<></>)}
      <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition">
        Chat
      </button>
      <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition">
        View Badges
      </button>
    </div>
  );
}