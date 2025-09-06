'use client'

import { courtType, reviewType } from "@/utils/TYPE";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import { Plus, Star, X } from "lucide-react";
import { useProfile } from "@/context/profileContext";
import { AddReviwetoCourt } from "@/utils/courts/AddReview";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import CourtReviewModal from "./ReviewWriter";

type CourtCardProps = {
    court: courtType;
};

export const CourtCard = ({ court }: CourtCardProps) => {
    const { selectedProfile } = useProfile()
    const [isReview, setIsReview] = useState(false);

    const handleSubmit = (review: any) => {
        if (!review) return
        const data: reviewType = {
            name: selectedProfile?.name || "unknown",
            comment: review.comment,
            rating: review.rating
        }
        AddReviwetoCourt(court.id, data)
        toast.success("Review Added to court")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white rounded-xl shadow-xl outline-none px-3 "
        >

            {/* Court Info */}
            {!isReview && <div className="p-4 space-y-3">
                <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {court.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    📍 {court.location?.address}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {court.description}
                </p>

                {/* Amenities */}
                {court.amenities && court.amenities.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {court.amenities.map((item, i) => (
                                <span
                                    key={i}
                                    className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded-full"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={() => setIsReview(true)} className="flex items-center text-xs   px-4 py-2 rounded-full font-bold bg-transparent  shadow hover:text-white hover:bg-blue-700 text-blue-600 border border-blue-700">
                    <Plus size={15} /> Add Review
                </button>
                {/* Reviews */}
                {court.reviews && court.reviews.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Reviews
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                            {court.reviews.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                                >
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            {r.name}
                                        </span>
                                        : {r.comment}
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={16}
                                                    className={`${star <= (r.rating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-400"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>}
            {isReview && (<div>
                <CourtReviewModal
                    courtName={court.title} isOpen={isReview} onClose={() => setIsReview(false)} onSubmit={handleSubmit} />
            </div>)}
        </motion.div>
    );
};
