import { db } from "@/services/config"
import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import toast from "react-hot-toast";


type reponseParams = {
    currentUserUid: string,
    currentUserProfileId: string,
    fromUserUid: string,
    fromUserProfileId: string,
    accepted: boolean,
    notifiId: string,
}

export const respontToPlaymatesRequest = async (
    { currentUserUid,
        currentUserProfileId,
        fromUserUid,
        fromUserProfileId,
        accepted,
        notifiId, }: reponseParams
) => {
    try {
        const currentProfileRef = doc(db, "users", currentUserUid, "profile", currentUserProfileId);
        const fromProfileRef = doc(db, "users", fromUserUid, "profile", fromUserProfileId);
        const notifiRef = doc(db, "users", currentUserUid, "profile", currentUserProfileId, "notifications", notifiId)

        if (accepted) {
            await updateDoc(currentProfileRef, {
                playmates: arrayUnion({ userUid: fromUserUid, profileId: fromUserProfileId})
            })
            await updateDoc(fromProfileRef, {
                playmates: arrayUnion({userUid:currentUserUid, profileId:currentUserProfileId})
            })
            await updateDoc(notifiRef, {
                status: "accepted",
                isRead: true
            })
            toast.success("You got a new Playmate!!!")
        }
        else {
            await updateDoc(notifiRef, {
                status: "rejected",
                isRead: true
            });
            toast.success('Request rejected');
        }

    } catch (err) {
        toast.error("Failed to respond to playmate request")
    }
}