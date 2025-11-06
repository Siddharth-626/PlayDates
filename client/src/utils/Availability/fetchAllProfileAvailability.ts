import { db } from "@/services/config";
import { collection, onSnapshot } from "firebase/firestore";
import { AvailabilityType } from "../TYPE";

export const fetchAllProfileAvailability = (
  userUid: string | undefined,
  profileId: string | undefined,
  callback: (availability: AvailabilityType[]) => void
) => {
  if (!userUid || !profileId) return;

  const availabilityRef = collection(
    db,
    `users/${userUid}/profile/${profileId}/availability`
  );

  return onSnapshot(availabilityRef, (snapshot) => {
    const availability = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as AvailabilityType;
    });

    callback(availability);
  });
};
