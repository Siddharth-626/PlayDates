import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/config";

export const checkIfProfileExist = async(uid:string): Promise<boolean> =>{
     const profileRef = doc(db,"users",uid,"profile","info");
     const profileSnap = await getDoc(profileRef);
     return profileSnap.exists();
  }
