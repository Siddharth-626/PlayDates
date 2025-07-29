import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const Loading = () => {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
        >
            <Loader2 className="animate-spin text-green-400 mb-2" size={40} />
            <span className="text-green-700 font-semibold">Loading....</span>
        </motion.div>
    );
}