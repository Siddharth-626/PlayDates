import { admin } from "./admin";
import { PlayersType } from "./Type";

const db = admin.firestore();

export const createChat = async (players: PlayersType[], matchId: string) => {

    const playerKeys = players.map((p) => (
        `${p.userUid}_${p.profileId}`
    ));

    await db.collection("chats").doc(matchId).set({
        type: "match",
        groupName: "",
        participants: players,
        participantsFinder: playerKeys,
        lastMessage: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        matchId
    });


};
