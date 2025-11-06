import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { AvailabilityType } from "../TYPE";
import { db } from "@/services/config";

type AvailabilityProps = {
    userUid: string | undefined;
    profileId: string | undefined;
    data: any;
};

export const AddAvailability = async ({
    userUid,
    profileId,
    data,
}: AvailabilityProps) => {
    if (!userUid || !profileId || !data) return;

    try {
        const availabilityRef = collection(
            db,
            "users",
            userUid,
            "profile",
            profileId,
            "availability",
        );

        await addDoc(availabilityRef, data);
    } catch (error) {
        console.error("❌ Error while posting availability:", error);
    }
};
