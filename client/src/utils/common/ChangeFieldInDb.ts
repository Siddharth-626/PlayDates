import { db } from "@/services/config";
import { doc, updateDoc } from "firebase/firestore";

export const ChangeFieldInDb = async (
  field: string,
  value: unknown,
  path: string
) => {
  console.log(`Changing field "${field}" in database at path: ${path}`);

  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, {
      [field]: value,
    });
    console.log("Changed field in db successfully");
  } catch (err) {
    console.error("Error while changing field in db:", err);
  }
};
