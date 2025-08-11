import { onDocumentUpdated } from "firebase-functions/firestore";
import { admin } from "../../utils/admin";

const db = admin.firestore();

 export const ChangeStatusOffProfileMatches = onDocumentUpdated({
    document:"matches/{matchId}",
    region:"asia-south1",
}, async(event)=>{

    const BeforeMatchData = event.data?.before.data();
    const AfterMatchData = event.data?.after.data();
    const matchId = event.params.matchId;

    if(!BeforeMatchData || !AfterMatchData) return
    if(BeforeMatchData.status != "Time-Preposed"&& AfterMatchData.status == "Time-Preposed"){
        const players = AfterMatchData.players;

        for(const player of players){
            const {userUid,profileId} = player;

            const playerMatchSnap = await db.doc(`users/${userUid}/profile/${profileId}/matches/${matchId}`).get();
            playerMatchSnap.ref.update({status:"Time-Preposed"});
        }
    }
})