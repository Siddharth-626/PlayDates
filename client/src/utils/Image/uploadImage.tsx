import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/services/config";

export const uploadImage = async (uid: string, file: File, profileId: string): Promise<string> => {
    const storageRef = ref(storage, `profileImages/${uid}/${profileId}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
};
