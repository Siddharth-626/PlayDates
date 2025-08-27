import { db } from "@/services/config"
import { doc, setDoc } from "firebase/firestore"
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
export const createCourt = async () => {
    try {
        const courtId = uuidv4();
        const courtRef = doc(db, "courts", courtId);

        await setDoc(courtRef, {
            title: "Wallace Park Public Court",
            description: "private park",
            location: {
                lat: 12.9716,
                lng: 77.5946,
                address: "245 Reynolds St, Oakville, ON"
            },
            images: ["/images/Home/pexels-ozanyavuz-31054362.jpg","images/Home/pexels-tima-miroshnichenko-6010279.jpg","images/Home/pexels-zetong-li-880728-13425628.jpg"],
            amenities: ["floodlight", "shower"],
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