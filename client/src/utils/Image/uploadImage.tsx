import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/services/config";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadImage = async (uid: string, file: File, profileId: string): Promise<string> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 5MB limit.");
    }
    const storageRef = ref(storage, `profileImages/${uid}/${profileId}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
};
