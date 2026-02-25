import { useCallback, useEffect, useState } from "react";
import { courtType, LocationStorageType } from "@/utils/TYPE";
import { ArrowLeft, Search } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useCourt } from "@/context/courtContext";
import { AddLocationToProfile } from "@/utils/PlayerProfile/AddLocationToProfile";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { debounce } from "@/utils/debounce";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { CourtCard } from "@/components/commonComponents/court/courtCard";
import { Button } from "@/components/ui/button";

export const DisplayCourts = () => {
    const { courts } = useCourt();
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [search, setSearch] = useState("");
    const [ProfilePreferedLocations, setProfilePreferedLocations] = useState<string[]>([]);
    const [sectedCourt, setSelectedCourt] = useState<courtType | undefined>(undefined);

    const debouncedToggleSelect = useCallback(
        debounce((court: courtType) => {
            toggleSelect(court);
        }, 1000),
        [] // dependencies can be added if needed
    );
    const toggleSelect = (court: courtType) => {
        const LocationData: LocationStorageType = {
            name: court.title,
            courtId: court.id
        }
        AddLocationToProfile(user?.uid, selectedProfile?.id, LocationData);
        toast.success("Location added to Profile")

        setProfilePreferedLocations((prev) => {
            if (prev.includes(court.title)) {
                return prev;
            }
            return [...prev, court.title];
        })
    }

    useEffect(() => {
        if (selectedProfile?.locations) {
            const initialLocations = selectedProfile.locations.map((loc) => loc.name);
            setProfilePreferedLocations(initialLocations);
        }
    }, [selectedProfile]);

    if (!courts) {
        return <Loading />;
    }

    const filteredCourts = courts.filter((court) =>
        court.title.toLowerCase().includes(search.toLowerCase()) ||
        court.location.address.toLowerCase().includes(search.toLowerCase())
    );

    const handleCourtSelect = (court: courtType | undefined) => {
        setSelectedCourt(court);
    }

    if (!filteredCourts || filteredCourts.length === 0) {
        return <Loading />;
    }
    return (
        <div>
            {!sectedCourt ? (<div className="p-4 max-w-6xl mx-auto">
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
                    <div className="grid md:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredCourts.map((court, index) => (
                                <motion.div
                                    key={court.title + index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    onClick={() => handleCourtSelect(court)}
                                    className="bg-gradient-to-r from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl overflow-hidden"
                                >

                                    <div className="p-4 space-y-2">
                                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
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
                                            onClick={() => debouncedToggleSelect(court)}
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
            </div>) :
                (
                    <motion.div
                        key="Court-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-4 flex justify-end">
                            <Button
                                variant="outline"
                                className="text-sm flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                onClick={() => setSelectedCourt(undefined)}
                                aria-label="Back to courts"
                            >
                                <ArrowLeft size={18} /> Back to Courts
                            </Button>
                        </div>
                        <CourtCard court={sectedCourt} />
                    </motion.div>
                )}
        </div>
    );
};
