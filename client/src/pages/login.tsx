import { useState } from "react";
import Link from "next/link";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { LogInIcon, UserPlus, ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import clsx from "clsx";
import Navbar from "../components/Navbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/config";
import { useRouter } from "next/router";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import { GoogleLogin } from "@/components/auth/GoogleLogin";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredentials.user.uid;
      const profileExist = await checkIfProfileExist(uid);
      await router.push(profileExist ? "/" : "/setup");
    } catch (err) {
      let message = "Login failed. Please try again.";
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-credential":
            message = "Invalid Email or Password";
            break;
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/too-many-requests":
            message = "Too many attempts. Please try again later.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your connection.";
            break;
          default:
            message = err.message;
        }
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 dark:from-gray-900 dark:via-green-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-900/80 shadow-2xl rounded-3xl backdrop-blur-lg border border-green-200 dark:border-green-700 relative overflow-hidden"
        >
          {/* Decorative Tennis Ball */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute -top-8 -left-8 w-20 h-20 flex items-center justify-center bg-green-300/40 dark:bg-green-700/40 rounded-full blur-xl z-0"
          >
            <ShieldCheck className="w-8 h-8 text-green-700 opacity-70" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="absolute -bottom-8 -right-8 w-20 h-20 flex items-center justify-center bg-green-400/30 dark:bg-green-800/30 rounded-full blur-xl z-0"
          >
            <ShieldCheck className="w-8 h-8 text-green-700 opacity-70" />
          </motion.div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <LogInIcon className="w-7 h-7 text-green-600 dark:text-green-300" />
              Welcome Back
            </h2>
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-100 mb-2 flex items-center gap-2">
              <span className="italic font-bold">PLAY DATES</span>
              <span className="text-green-500 animate-bounce" role="img" aria-label="tennis ball">🎾</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-base">
              Sign in to join the fun and track your matches!
            </p>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 px-4 py-2 mb-4 rounded-md text-sm font-medium"
              >
                {error}
              </motion.p>
            )}

            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <label className="text-green-900 dark:text-green-200 text-sm font-semibold mb-1 block" htmlFor="email">
                Email
              </label>
              <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
                <Mail className="text-green-500 mr-2 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-label="Email"
                />
              </div>

              {/* Password Input */}
              <label className="text-green-900 dark:text-green-200 text-sm font-semibold mb-1 block" htmlFor="password">
                Password
              </label>
              <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-2 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
                <Lock className="text-green-500 mr-2 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="ml-2 focus:outline-none disabled:opacity-50"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-gray-500 dark:text-gray-300 w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="text-gray-500 dark:text-gray-300 w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Links */}
              <div className="flex justify-between mb-4">
                <Link
                  href="#"
                  className="text-sm text-green-700 dark:text-green-300 font-semibold hover:underline transition"
                >
                  Forgot Password?
                </Link>
                <Link href="/signup" className="flex items-center gap-1 text-sm text-green-700 dark:text-green-300 font-semibold hover:underline transition">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={clsx(
                  "w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white py-2 rounded-lg hover:bg-green-800 dark:hover:bg-green-700 transition font-semibold cursor-pointer shadow-lg flex items-center justify-center gap-2 text-lg",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogInIcon className="w-5 h-5" />
                )}
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-green-200 dark:bg-green-700" />
              <span className="mx-3 text-gray-500 dark:text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-grow h-px bg-green-200 dark:bg-green-700" />
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="mt-2 w-full"
            >
              <GoogleLogin />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
