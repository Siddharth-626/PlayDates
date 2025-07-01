import { db } from "@/services/config"
import { doc, setDoc } from "firebase/firestore"
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
export const createCourt = async () => {
    try {
        const courtId = uuidv4();
        const courtRef = doc(db, "courts", courtId);

        await setDoc(courtRef, {
            title: "City Central Tennis Court",
            description: "Great court with lighting and clay surface",
            location: {
                lat: 12.9716,
                lng: 77.5946,
                address: "MG Road, Bangalore"
            },
            images: ["https://.../court1.jpg"],
            amenities: ["floodlight", "parking", "shower"],
            createdBy: "admin_uid_or_user_uid",
            isApproved: true,
            createdAt: new Date().toISOString()
        }
        )
        toast.success("court added");
    } catch (err) {
        console.log(err);
    }
}