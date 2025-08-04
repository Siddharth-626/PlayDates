import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import SplitText from '../Animations/TextAnimations/SplitText/SplitText';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  Bell,
  UserPlus,
  Settings,
  BarChart2,
  Star,
  Globe2,
  MessageCircle,
} from 'lucide-react';

const features = [
  {
    title: "Schedule Matches",
    icon: <CalendarDays className="w-7 h-7 text-green-600" />,
    description: "Coordinate tennis matches based on your availability and preferences.",
  },
  {
    title: "Find Nearby Players",
    icon: <MapPin className="w-7 h-7 text-green-600" />,
    description: "Connect with tennis players around your location quickly and reliably.",
  },
  {
    title: "Track Your Progress",
    icon: <Trophy className="w-7 h-7 text-green-600" />,
    description: "Log your game history and monitor your improvement over time.",
  },
  {
    title: "Instant Notifications",
    icon: <Bell className="w-7 h-7 text-green-600" />,
    description: "Stay updated with match invites, playmate requests, and more.",
  },
  {
    title: "Easy Profile Setup",
    icon: <UserPlus className="w-7 h-7 text-green-600" />,
    description: "Create and customize your tennis profile in seconds.",
  },
  {
    title: "Advanced Stats",
    icon: <BarChart2 className="w-7 h-7 text-green-600" />,
    description: "Analyze your match stats and skill progression.",
  },
  {
    title: "Global Community",
    icon: <Globe2 className="w-7 h-7 text-green-600" />,
    description: "Join a growing network of tennis enthusiasts worldwide.",
  },
  {
    title: "Messaging",
    icon: <MessageCircle className="w-7 h-7 text-green-600" />,
    description: "Chat with playmates and coordinate matches easily.",
  },
  {
    title: "Personalized Experience",
    icon: <Star className="w-7 h-7 text-green-600" />,
    description: "Tailor your dashboard and notifications to your needs.",
  },
  {
    title: "Smart Court Finder",
    icon: <Settings className="w-7 h-7 text-green-600" />,
    description: "Discover and book nearby tennis courts effortlessly.",
  },
];

export const Startup = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen px-4 py-12 bg-gradient-to-br from-green-100 via-white to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex-1 w-full"
        >
          <img
            src="/images/tennis.png"
            alt="Playdates Logo"
            className="w-32 h-32 md:w-40 md:h-40 mb-6 mx-auto lg:mx-0 drop-shadow-xl"
          />

          <div className="max-w-xl mb-6">
            <SplitText
              text="Your Tennis Journey Starts Here"
              className="fancyPants text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight"
              delay={80}
              duration={1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
              onLetterAnimationComplete={() => {}}
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Welcome to
            <span className='text-bold text-2xl font-sans font text-green-600 ml-2'>PLAYDATES</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 text-lg leading-relaxed">
            Discover and schedule matches with players near you based on availability, location, and skill level. Sign up now to join the Play Dates community!
          </p>

          {!user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <Link href="/login">
                <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow hover:bg-green-800 transition flex items-center gap-2 font-semibold">
                  Login <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT SECTION: Features Grid */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex-1 w-full flex justify-center items-center"
        >
          <div className="w-full max-w-xl">
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-200 mb-6 text-center">Why Playdates?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.07, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(34,197,94,0.15)" }}
                  className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
                  tabIndex={0}
                  aria-label={feature.title}
                >
                  <div>{feature.icon}</div>
                  <div>
                    <div className="font-bold text-green-700 dark:text-green-200 text-lg">{feature.title}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
