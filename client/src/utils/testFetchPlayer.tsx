import { useEffect } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../services/config"; // check path is correct

export default function TestProfileFetcher() {
    const userId = "1mAgDlXVQEMvgPurkTEeOrSrMWz1";
    const profileId = "20d25e5f-3974-4ff7-82c4-4c63a828b1d0";

    useEffect(() => {
        const fetch = async () => {
            try {
                const ref = collection(db, "users", userId, "profiles");
                const snap = await getDocs(ref);

                snap.forEach((docSnap) => {
                    if (docSnap.id === profileId) {
                        console.log("Matched Profile Data:", docSnap.data());
                    }
                    console.log(docSnap.data());
                });
            } catch (err) {
                console.error("Error fetching profiles:", err);
            }
        };
        fetch();
    }, []);

    return <div>Check console</div>;
}
