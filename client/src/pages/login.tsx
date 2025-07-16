import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Navbar from "../components/Navbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/config";
import { useRouter } from "next/router";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import { GoogleLogin } from "@/components/auth/GoogleLogin";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
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

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredentials.user.uid;

      const profileExist = await checkIfProfileExist(uid);
      router.push(profileExist ? "/" : "/setup");
    } catch (err: any) {
      console.error("Login error:", err);

      let message = "Login failed. Please try again.";

      // Optional: Add Firebase-specific error handling
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
    }
  };
  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-1">
            HELLO!
          </h2>

          <h3 className="text-2xl font-semibold text-green-800 dark:text-green-100 mb-2">
            Welcome to <span className="italic font-bold">PLAY DATES</span>
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Please login with your account
          </p>

          {error && (
            <p className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 px-4 py-2 mb-4 rounded-md text-sm font-medium">
              {error}
            </p>
          )}

          {/* Email Input */}
          <label className="text-green-900 dark:text-green-200 text-sm font-semibold mb-1 block">
            Email
          </label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700">
            <FiMail className="text-green-500 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <label className="text-green-900 dark:text-green-200 text-sm font-semibold mb-1 block">
            Password
          </label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-2 bg-green-50 dark:bg-gray-700">
            <FiLock className="text-green-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <AiOutlineEyeInvisible
                className="text-gray-500 cursor-pointer ml-2 dark:text-gray-300"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiOutlineEye
                className="text-gray-500 cursor-pointer ml-2 dark:text-gray-300"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {/* Links */}
          <Link
            href="#"
            className="text-sm text-green-700 dark:text-green-300 font-semibold hover:underline block mb-4 text-right"
          >
            Forgot Password?
          </Link>

          <Link href="/signup">
            <div className="text-sm text-green-700 dark:text-green-300 font-semibold hover:underline block mb-4 text-left">
              Create Account
            </div>
          </Link>

          {/* Login Button */}
          <button
            className="w-full bg-green-700 dark:bg-green-600 text-white py-2 rounded-lg hover:bg-green-800 dark:hover:bg-green-700 transition font-semibold cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium">
            OR CONTINUE WITH
          </p>
          <div className="mt-4 w-full">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
