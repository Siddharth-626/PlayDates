import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { MoonIcon, SunIcon, HomeIcon, LogInIcon, UserCircle2, MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProfileInfo } from './auth/ProfileInfo';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mount, setMount] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-lg transition-colors">
      {/* Left Side - Logo & Home */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-white hover:text-green-200 transition">
          <HomeIcon className="w-7 h-7" />
          Playdates
        </Link>
      </div>

      {/* Right Side - Menu */}
      <div className="flex items-center gap-4">
        {/* Responsive Hamburger */}
        <button
          className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>

        <div className={`flex-col md:flex-row md:flex items-center gap-4 ${menuOpen ? 'flex' : 'hidden'} md:gap-4 absolute md:static top-16 right-6 bg-green-700 md:bg-transparent rounded-xl shadow-lg md:shadow-none p-4 md:p-0 z-50`}>
          {!user ? (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition font-semibold">
              <LogInIcon className="w-5 h-5" />
              Login
            </Link>
          ) : (
            <div className="relative group">
                <ProfileInfo />
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition font-semibold"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <MoonIcon className="w-5 h-5" />

              </>
            ) : (
              <>
                <SunIcon className="w-5 h-5" />

              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
