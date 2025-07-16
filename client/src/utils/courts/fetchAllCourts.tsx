import { db } from "@/services/config";
import { collection, getDocs } from "firebase/firestore";
import { courtType } from "../TYPE";



export const fetchAllCourts = async () => {
    try {
        const courtsRef = collection(db, "courts");
        const courtSnap = await getDocs(courtsRef)

        const courts = courtSnap.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                amenities: data.amenities,
                createdAt: data.createdAt?.toDate?.().toISOString?.() || "",
                createdBy: data.createdBy,
                isApproved: data.isApproved,
                images: data.images,
                location: {
                    address: data.location?.address || "",
                    lat: data.location?.lat || 0,
                    lng: data.location?.lng || 0,
                },
            }
        })
        return courts;
    } catch (error) {
        console.log("err while fetching all locations");

    }
}