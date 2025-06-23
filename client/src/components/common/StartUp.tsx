import { useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import Navbar from '../Navbar';
import Link from 'next/link';
import gsap from 'gsap';

const features = [
  {
    title: "Schedule Matches",
    icon: "📅",
    description: "Easily coordinate tennis matches based on your availability and preferences.",
  },
  {
    title: "Find Nearby Players",
    icon: "📍",
    description: "Connect with tennis players around your location quickly and reliably.",
  },
  {
    title: "Track Your Progress",
    icon: "🏆",
    description: "Log your game history and monitor your improvement over time.",
  },
];

export const Startup = () => {
  const { user } = useAuth();

  useEffect(() => {
    let splitTextInstance: any;
    let fancyTitleAnim: gsap.core.Timeline;

    import('gsap/SplitText').then(({ default: SplitText }) => {
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(SplitText);

        splitTextInstance = SplitText.create('.fancyPants', { type: 'chars, lines' });

        fancyTitleAnim = gsap.timeline()
          .from(splitTextInstance.chars, {
            duration: 1,
            yPercent: 105,
            stagger: { each: 0.05, from: 'start' },
          })
          .to(splitTextInstance.chars, {
            duration: 1,
            yPercent: -105,
            stagger: { each: 0.05, from: 'end' },
          });

        const element = document.querySelector('.fancyPants');
        element?.addEventListener('pointerdown', () => fancyTitleAnim.restart());
      }
    });
  }, []);

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-400  to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <img
          src="/images/tennis.png"
          alt="Playdates Logo"
          className="w-48 h-48 md:w-64 md:h-64 mb-20 drop-shadow-xl"
        />

        <h1 className="fancyPants text-5xl md:text-7xl font-extrabold mb-2 cursor-pointer select-none">
          <span className="text-green-800 dark:text-green-400">PLAY TENNIS</span> WITH PLAYDATES
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">
          Welcome to <span className="italic font-bold">PLAY DATES</span>
        </h2>

        <p className="text-gray-700 dark:text-gray-300 max-w-md mb-10 text-lg leading-relaxed">
          Discover and schedule matches with players near you based on availability, location, and skill level. Sign up now to join the Play Dates community!
        </p>

        {!user && (
          <div className="flex gap-4 mb-12">
            <Link href="/login">
              <button className="px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 dark:bg-green-700 dark:text-white dark:hover:bg-green-600 transition">
                Create Account
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-green-100 dark:border-green-700"
            >
              <h3 className="text-green-700 dark:text-green-300 text-xl font-bold mb-3">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
