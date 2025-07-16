import { collection, doc, setDoc } from "firebase/firestore";
import { AvailabilityType } from "../TYPE";
import { db } from "@/services/config";

type AvailabilityProps = {
    userUid: string | undefined;
    profileId: string | undefined;
    data: AvailabilityType;
    AvailibilityId: string;
};

export const AddAvailability = async ({
    userUid,
    profileId,
    data,
    AvailibilityId,
}: AvailabilityProps) => {
    if (!userUid || !profileId || !data || !AvailibilityId) return;

    try {
        const availabilityRef = doc(
            db,
            "users",
            userUid,
            "profile",
            profileId,
            "availability",
            AvailibilityId
        );

        await setDoc(availabilityRef, data);
    } catch (error) {
        console.error("❌ Error while posting availability:", error);
    }
};
