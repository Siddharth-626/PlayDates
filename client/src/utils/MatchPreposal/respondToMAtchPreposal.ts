import { db } from "@/services/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

type respondToMatchPreposalType = {
    matchId: string;
    userUid: string | undefined;
    profileId: string | undefined;
    status: string;
}
export const respondToMatchPreposal = async({
    matchId,
    userUid,
    profileId,
    status
}: respondToMatchPreposalType) => {

    const MatchRef = doc(db, "matches", matchId);
    const matchSnap = await getDoc(MatchRef);

    const matchData = matchSnap?.data();
    if(!matchData) return

    const updatedPlayers = matchData.players.map((player:any)=>{
        if(player.userUid == userUid && player.profileId == profileId){
            return {...player,status:status};
        }
        return player
    })

    const allAccepted = updatedPlayers.every((p: any) => p.status === "accepted");
    const anyRejected = updatedPlayers.some((p: any) => p.status === "rejected");

    let matchStatus = matchData.status;
    if (allAccepted) {
        matchStatus = "accepted";
    } else if (anyRejected) {
        matchStatus = "rejected";
    }

    await updateDoc(MatchRef, {
        players: updatedPlayers,
        status: matchStatus,
    });
}
