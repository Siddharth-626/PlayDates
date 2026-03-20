import AvailabilitySelector from "@/components/availability/Recuring-availlability/AvailabilitySelector "
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";


const Availability = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading]);

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-10">
                <AvailabilitySelector />
            </div>
        </div>
    )
}
export default Availability;
