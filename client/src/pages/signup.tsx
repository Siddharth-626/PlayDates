import { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/services/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { checkIfProfileExist } from '@/utils/checkUserProfile';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setError('');
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Invalid email format');
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phoneNumber,
        createdAt: new Date().toISOString(),
      });

      const uid = user.uid;
      const profileExist = await checkIfProfileExist(uid);
      router.push(profileExist ? '/' : '/setup');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login or use a different email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email. Please enter a valid email address.');
      } else {
        setError(err.message || 'Signup failed');
      }
      console.error('Error while signing up:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2 uppercase">Hello!</h2>
          <h3 className="text-xl font-semibold mb-6">
            Create your <em>PLAY DATES</em> account
          </h3>

          {/* Name */}
          <label className="block mb-1 text-sm font-medium">Name</label>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 boder-green-50 rounded-lg px-3 py-2 mb-4">
            <FiUser className="text-green-500 mr-2" />
            <input
              type="text"
              placeholder="Enter your name"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <label className="block mb-1 text-sm font-medium">Email</label>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 boder-green-50 rounded-lg px-3 py-2 mb-4">
            <FiMail className="text-green-500 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 boder-green-50 rounded-lg px-3 py-2 mb-4">
            <FiLock className="text-green-500 mr-2" />
            <input
              type="password"
              placeholder="Enter your password"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <label className="block mb-1 text-sm font-medium">Confirm Password</label>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 border-green-50 rounded-lg px-3 py-2 mb-4">
            <FiLock className="text-green-500 mr-2" />
            <input
              type="password"
              placeholder="Re-enter your password"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <label className="block mb-1 text-sm font-medium">Phone Number</label>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 border-green-50 rounded-lg px-3 py-2 mb-6">
            <FiPhone className="text-green-500 mr-2" />
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="flex-grow bg-transparent outline-none text-green-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm font-medium text-red-500 mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            onClick={handleSignup}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}
