import { useEffect, useState } from "react";
import { courtType, LocationStorageType } from "@/utils/TYPE";
import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useCourt } from "@/context/courtContext";
import { AddLocationToProfile } from "@/utils/PlayerProfile/AddLocationToProfile";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";

export const DisplayCourts = () => {
    const { courts } = useCourt();
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [search, setSearch] = useState("");
    const [ProfilePreferedLocations, setProfilePreferedLocations] = useState<string[]>([]);

    if (!courts) {
        return <p className="text-center text-gray-500 mt-10">Loading courts...</p>;
    }
    const ProfileLocations: string[] | undefined = selectedProfile?.locations.map((loc) => loc.name);

    const filteredCourts = courts.filter((court) =>
        court.title.toLowerCase().includes(search.toLowerCase()) ||
        court.location.address.toLowerCase().includes(search.toLowerCase())
    );
    const toggleSelect = (court: courtType) => {
        const LocationData: LocationStorageType = {
            name: court.title,
            courtId: court.id
        }
        AddLocationToProfile(user?.uid, selectedProfile?.id, LocationData);
        if (!ProfileLocations) return;
        setProfilePreferedLocations(ProfileLocations)
    }

    useEffect(() => {
        if (!ProfileLocations) return;
        setProfilePreferedLocations(ProfileLocations)
    }, [ProfileLocations])

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search courts by name or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm dark:bg-gray-900 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>

            {filteredCourts.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No courts found.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredCourts.map((court, index) => (
                            <motion.div
                                key={court.title + index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden"
                            >
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    loop
                                    className="w-full h-56"
                                >
                                    {court.images?.map((imgUrl, i) => (
                                        <SwiperSlide key={i}>
                                            <img
                                                src={imgUrl}
                                                alt={`Court image ${i + 1}`}
                                                className="w-full h-56 object-cover"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="p-4 space-y-2">
                                    <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                                        {court.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {court.location?.address}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {court.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {court.amenities?.map((item, i) => (
                                            <span
                                                key={i}
                                                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded-full"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => toggleSelect(court)}
                                        className={`mt-4 w-full py-2 text-sm rounded-lg font-semibold transition ${ProfilePreferedLocations?.includes(court.title)
                                            ? "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white"
                                            : "bg-green-600 text-white"
                                            }`}
                                    >
                                        {ProfilePreferedLocations?.includes(court.title) ? "Added" : "Add court"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
