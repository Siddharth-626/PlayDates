import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import LogoutButton from './auth/logout';
import { useTheme } from '@/context/ThemeContext';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createCourt } from '@/utils/testFunctions/createCourt';
import { ProfileInfo } from './auth/ProfileInfo';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-green-600 dark:bg-green-700 shadow-sm transition-colors">
      {/* Left Side - Logo */}
      <Link href="/" className="text-xl font-bold text-white dark:text-white-400">
        Playdates
      </Link>

      {/* Right Side - Auth Buttons & Theme Toggle */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link href="/login">
              <span className="px-4 py-2 rounded-md bg-transperent border-blue-700 text-white hover:underline   transition">
                Login
              </span>
            </Link>
          </>
        ) : (
          <ProfileInfo />
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}
