import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { MoonIcon, SunIcon, HomeIcon, LogInIcon, MenuIcon } from 'lucide-react';
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
    <nav className="w-full px-6 py-3 flex items-center justify-between bg-[var(--surface-raised)] border-b border-[var(--border-subtle)] shadow-elevation-1 transition-colors">
      {/* Left Side - Logo & Home */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-[var(--content-primary)] hover:text-[var(--accent-green)] transition">
          <HomeIcon className="w-7 h-7" />
          Playdates
        </Link>
      </div>

      {/* Right Side - Menu */}
      <div className="flex items-center gap-4">
        {/* Responsive Hamburger */}
        <button
          className="md:hidden p-2 rounded-full bg-[var(--surface-inset)] hover:bg-[var(--border-subtle)] transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>

        <div className={`flex-col md:flex-row md:flex items-center gap-4 ${menuOpen ? 'flex' : 'hidden'} md:gap-4 absolute md:static top-16 right-6 bg-[var(--surface-raised)] md:bg-transparent rounded-xl shadow-dropdown md:shadow-none p-4 md:p-0 z-50 border border-[var(--border-subtle)] md:border-none`}>
          {!user ? (
            <Link href="/login" className="btn-primary flex items-center gap-2 text-sm">
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
            className="p-2 rounded-xl bg-[var(--surface-inset)] hover:bg-[var(--border-subtle)] text-[var(--content-secondary)] transition"
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
