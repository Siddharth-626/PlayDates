import Navbar from "@/components/Navbar";
import ProfileSetupForm from "@/components/profile/SetupProfile/ProfileSetupForm";
import { useAuth } from "@/context/authContext";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { GiTennisBall  } from "react-icons/gi";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function SetupProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <> <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-slate-200 to-green-200 dark:from-gray-900 dark:via-green-900 dark:to-gray-800 px-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-3xl p-8 bg-white/80 dark:bg-gray-900/80 shadow-2xl rounded-3xl backdrop-blur-lg border border-green-200 dark:border-green-700 relative overflow-hidden"
        >
          {/* Decorative Tennis Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute -top-8 -left-8 w-16 h-16 flex items-center justify-center bg-green-300/40 dark:bg-green-700/40 rounded-full blur-xl z-0"
          >
            <GiTennisBall className="w-8 h-8 text-green-600 opacity-80" />
          </motion.div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <UserPlus className="w-7 h-7 text-green-600 dark:text-green-300" />
              Create Your Profile
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-base">
              Set up your tennis profile to get started!
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              <ProfileSetupForm
                update={false}
                onClose={() => { }}
                onSuccess={() => { }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
