
import { db } from "@/services/config";
import { doc, setDoc, } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

type RequestPrams = {
    fromUserUid: string | undefined;
    fromProfileId: string | undefined;
    toUserUid: string | undefined;
    toProfileId: string | undefined
}
export const sendPlayMatesRequest = async ({
    fromProfileId,
    fromUserUid,
    toUserUid,
    toProfileId
}: RequestPrams) => {
    if (!fromUserUid || !fromProfileId || !toUserUid || !toProfileId) {
        throw new Error("Missing required parameters to send playmates request.");
    }
    const notiifId = uuidv4();
    const ProfileRef = doc(db, "users", toUserUid, "profile", toProfileId, "notifications", notiifId);
    await setDoc(ProfileRef, {
        id: notiifId,
        type: "playmates request",
        fromUserUid,
        fromProfileId,
        isRead: false,
        status: "pending",
    })
}