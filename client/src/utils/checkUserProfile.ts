import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/config";

export const checkIfProfileExist = async (uid: string): Promise<boolean> => {
   const profileCollectionRef = collection(db, "users", uid, "profile");
   const profileSnapshot = await getDocs(profileCollectionRef);
   return !profileSnapshot.empty;
};
