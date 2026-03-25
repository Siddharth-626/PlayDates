import { useCallback, useEffect, useState } from "react";
import { courtType, LocationStorageType } from "@/utils/TYPE";
import { ArrowLeft, Search, MapPin, Check } from "lucide-react";
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

export const DisplayCourts = () => {
    const { courts } = useCourt();
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [search, setSearch] = useState("");
    const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
    const [selectedCourt, setSelectedCourt] = useState<courtType | undefined>(undefined);

    useEffect(() => {
        if (selectedProfile?.locations) {
            setPreferredLocations(selectedProfile.locations.map((loc) => loc.name));
        }
    }, [selectedProfile]);

    if (!courts) return <Loading />;

    const filteredCourts = courts.filter(
        (court) =>
            court.title.toLowerCase().includes(search.toLowerCase()) ||
            court.location.address.toLowerCase().includes(search.toLowerCase())
    );

    const debouncedToggle = useCallback(
        debounce((court: courtType) => {
            const data: LocationStorageType = { name: court.title, courtId: court.id };
            AddLocationToProfile(user?.uid, selectedProfile?.id, data);
            toast.success("Court added to your profile");
            setPreferredLocations((prev) =>
                prev.includes(court.title) ? prev : [...prev, court.title]
            );
        }, 300),
        []
    );

    if (!filteredCourts || filteredCourts.length === 0) return <Loading />;

    return (
        <div className="min-h-screen bg-[var(--surface-base)]">
            {!selectedCourt ? (
                <div className="p-4 md:p-6">
                    {/* ── Header ─────────────────────────────────────── */}
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-[var(--accent-green)]" />
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-[var(--content-primary)]">Find Courts</h1>
                            <p className="text-[12px] text-[var(--content-muted)]">Browse and save your favourite courts</p>
                        </div>
                    </div>

                    {/* ── Search ─────────────────────────────────────── */}
                    <div className="flex items-center bg-[var(--surface-inset)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 gap-2 mb-5">
                        <Search className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                        <input
                            type="text"
                            placeholder="Search courts by name or address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-[var(--content-primary)] placeholder:text-[var(--content-muted)]"
                        />
                    </div>

                    {/* ── Court grid ─────────────────────────────────── */}
                    {filteredCourts.length === 0 ? (
                        <p className="text-center text-[var(--content-muted)] mt-12">No courts found.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <AnimatePresence>
                                {filteredCourts.map((court, idx) => {
                                    const isAdded = preferredLocations.includes(court.title);
                                    return (
                                        <motion.div
                                            key={court.id || court.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                                            onClick={() => setSelectedCourt(court)}
                                            className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--accent-green)]/50 hover:shadow-card transition-all group"
                                        >
                                            <div className="p-4 space-y-2.5">
                                                <h3 className="text-[16px] font-bold text-[var(--content-primary)] leading-tight group-hover:text-[var(--accent-green)] transition-colors">
                                                    {court.title}
                                                </h3>
                                                <p className="text-[13px] text-[var(--content-secondary)] leading-snug flex items-start gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-green)] shrink-0 mt-0.5" />
                                                    {court.location?.address}
                                                </p>
                                                {court.description && (
                                                    <p className="text-[13px] text-[var(--content-muted)] line-clamp-2">
                                                        {court.description}
                                                    </p>
                                                )}

                                                {/* Amenity chips */}
                                                {court.amenities?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {court.amenities.map((item) => (
                                                            <span
                                                                key={item}
                                                                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--content-muted)]"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Add/Added button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        debouncedToggle(court);
                                                    }}
                                                    className={`mt-2 w-full py-2 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                                                        isAdded
                                                            ? "bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/40 text-[var(--accent-green)]"
                                                            : "bg-[var(--accent-green)] text-white hover:opacity-90"
                                                    }`}
                                                >
                                                    {isAdded ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5" /> Added
                                                        </>
                                                    ) : (
                                                        "Add Court"
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-6"
                >
                    <button
                        onClick={() => setSelectedCourt(undefined)}
                        className="flex items-center gap-2 text-[13px] text-[var(--content-secondary)] hover:text-[var(--content-primary)] transition-colors mb-4 border border-[var(--border-subtle)] hover:border-[var(--accent-green)]/50 px-3 py-2 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Courts
                    </button>
                    <CourtCard court={selectedCourt} />
                </motion.div>
            )}
        </div>
    );
};
