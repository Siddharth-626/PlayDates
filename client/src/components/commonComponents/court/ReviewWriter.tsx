"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type CourtReviewModalProps = {
    courtName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (review: { rating: number; comment: string }) => void;
};

export default function CourtReviewModal({
    courtName,
    isOpen,
    onClose,
    onSubmit,
}: CourtReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (rating === 0 || !comment.trim()) return;
        onSubmit({ rating, comment });
        setRating(0);
        setComment("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md p-6 relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
                        >
                            <X size={20} />
                        </button>

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
                            Review {courtName}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        size={28}
                                        className={`${star <= (hover || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-400"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comment Box */}
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full h-28 p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />

                        {/* Submit Button */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={rating === 0 || !comment.trim()}
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                            >
                                Submit Review
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
