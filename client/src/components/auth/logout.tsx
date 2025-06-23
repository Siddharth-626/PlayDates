'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/services/config';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWalking } from 'react-icons/fa';

export default function AnimatedLogoutManButton() {
  const [step, setStep] = useState<'idle' | 'walking' | 'falling'>('idle');
  const router = useRouter();

  const handleLogout = async () => {
    setStep('walking');

    setTimeout(() => {
      setStep('falling');
    }, 1000); // after walking animation

    setTimeout(async () => {
      await signOut(auth);
      router.push('/login');
    }, 1800); // after falling animation
  };

  return (
    <button
      onClick={handleLogout}
      className="relative bg-transprent text-white px-4 py-2 rounded-md flex items-center justify-center overflow-hidden w-44 h-12  hover:transition-colors"
    >
      <span className="z-10 text-sm font-medium">Log Out</span>

      {/* Door */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-10 bg-blue-600 rounded z-0"
        animate={step === 'falling' ? { rotateY: 80 } : { rotateY: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '100% 50%',
        }}
      />

      {/* Man walking and falling */}
      {step !== 'falling' && (
        <motion.div
          className="absolute bottom-1 right-10 z-10 text-white"
          initial={{ x: 0, y: 0 }}
          animate={step === 'walking' ? { x: 15, transition: { duration: 1 } } : {}}
        >
          <FaWalking size={20} />
        </motion.div>
      )}

      {step === 'falling' && (
        <motion.div
          className="absolute bottom-1 right-4 z-10 text-white"
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: 80, rotate: 720 }}
          transition={{ duration: 0.8 }}
        >
          <FaWalking size={20} />
        </motion.div>
      )}
    </button>
  );
}
