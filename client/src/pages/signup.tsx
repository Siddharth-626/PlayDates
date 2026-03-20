import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FiPhone } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/services/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { checkIfProfileExist } from '@/utils/checkUserProfile';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/authContext';

export default function Signup() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSignup = async () => {
    setError('');
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      setLoading(true);
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phoneNumber,
        createdAt: new Date().toISOString(),
      });
      toast.success("User registered successfully");
      const profileExist = await checkIfProfileExist(user.uid);
      router.push(profileExist ? '/' : '/setup');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login or use a different email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email. Please enter a valid email address.');
      } else {
        setError(err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 backdrop-blur-lg border border-green-200 dark:border-green-700"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="text-3xl font-extrabold text-green-600 dark:text-green-300 mb-2 uppercase flex items-center gap-2"
          >
            <User className="w-7 h-7" />
            Sign Up
          </motion.h2>
          <h3 className="text-xl font-semibold mb-6">
            Create your <span className="font-bold text-green-500 dark:text-green-400">PLAY DATES</span> account
          </h3>

          {/* Name */}
          <label className="block mb-1 text-sm font-medium text-green-900 dark:text-green-200" htmlFor="name">Name</label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <User className="text-green-500 mr-2 w-5 h-5" />
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-label="Name"
            />
          </div>

          {/* Email */}
          <label className="block mb-1 text-sm font-medium text-green-900 dark:text-green-200" htmlFor="email">Email</label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Mail className="text-green-500 mr-2 w-5 h-5" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email"
            />
          </div>

          {/* Password */}
          <label className="block mb-1 text-sm font-medium text-green-900 dark:text-green-200" htmlFor="password">Password</label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Lock className="text-green-500 mr-2 w-5 h-5" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password (min. 6 chars)"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="Password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-2 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-gray-500 dark:text-gray-300 w-5 h-5" />
              ) : (
                <AiOutlineEye className="text-gray-500 dark:text-gray-300 w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <label className="block mb-1 text-sm font-medium text-green-900 dark:text-green-200" htmlFor="confirmPassword">Confirm Password</label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-4 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Lock className="text-green-500 mr-2 w-5 h-5" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="Confirm Password"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="ml-2 focus:outline-none"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible className="text-gray-500 dark:text-gray-300 w-5 h-5" />
              ) : (
                <AiOutlineEye className="text-gray-500 dark:text-gray-300 w-5 h-5" />
              )}
            </button>
          </div>

          {/* Phone Number */}
          <label className="block mb-1 text-sm font-medium text-green-900 dark:text-green-200" htmlFor="phone">Phone Number</label>
          <div className="flex items-center border border-green-200 dark:border-green-600 rounded-lg px-3 py-2 mb-6 bg-green-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <FiPhone className="text-green-500 mr-2 w-5 h-5" />
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
              aria-label="Phone Number"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 px-4 py-2 mb-4 rounded-md text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-green-800 dark:hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSignup}
            disabled={loading}
            type="button"
            aria-label="Register"
          >
            {loading ? "Registering..." : <><span>Register</span> <ArrowRight className="w-5 h-5" /></>}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
