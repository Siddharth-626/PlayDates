import { useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import SplitText from '../Animations/TextAnimations/SplitText/SplitText';
import CardSwap, { Card } from '../Animations/Components/CardSwap/CardSwap';

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

const features = [
  {
    title: "Schedule Matches",
    icon: "\uD83D\uDCC5",
    description: "Easily coordinate tennis matches based on your availability and preferences.",
  },
  {
    title: "Find Nearby Players",
    icon: "\uD83D\uDCCD",
    description: "Connect with tennis players around your location quickly and reliably.",
  },
  {
    title: "Track Your Progress",
    icon: "\uD83C\uDFC6",
    description: "Log your game history and monitor your improvement over time.",
  },
];

export const Startup = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="relative min-h-screen px-4 py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
          {/* LEFT SECTION */}
          <div className="flex-1">
            <img
              src="/images/tennis.png"
              alt="Playdates Logo"
              className="w-32 h-32 md:w-40 md:h-40 mb-6 mx-auto lg:mx-0 drop-shadow-xl"
            />

            <div className="max-w-xl mb-6">
              <SplitText
                text="Your Tennis Journey  Starts Here"
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
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Welcome to
              <span className='text-bold text-2xl font-sans font'> PLAYDATES</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 text-lg leading-relaxed">
              Discover and schedule matches with players near you based on availability, location, and skill level. Sign up now to join the Play Dates community!
            </p>

            {!user && (
              <div className="flex gap-4 justify-center lg:justify-start">
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
          </div>

          {/* RIGHT SECTION: Floating Cards */}
          {/* RIGHT SECTION: Floating Cards */}
          <div className="fixed bottom-6 right-6 z-50 scale-[0.8] sm:scale-90 md:scale-100 hidden md:block">
            <CardSwap
              cardDistance={150}
              verticalDistance={100}
              delay={5000}
              pauseOnHover={true}
              width={800}
              height={500}
            >
              <Card>
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-xl shadow-xl">
                  <h3 className="text-2xl font-semibold text-black dark:text-white font-sans">🎾 Smooth</h3>
                  <img
                    src="/images/Home/pexels-ozanyavuz-31054362.jpg"
                    alt="Card 1"
                    className="rounded-2xl mt-4 w-full h-full object-cover"
                  />
                </div>
              </Card>
              <Card>
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-xl shadow-xl">
                  <h3 className="text-2xl font-semibold text-black dark:text-white font-sans">💻 Reliable</h3>
                  <img
                    src="/images/Home/pexels-tima-miroshnichenko-6010279.jpg"
                    alt="Card 2"
                    className="rounded-2xl mt-4 w-full h-full object-cover"
                  />
                </div>
              </Card>
              <Card>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                  <h3 className="text-2xl font-semibold text-black dark:text-white font-sans">⚙️ Customizable</h3>
                  <img
                    src="/images/Home/pexels-zetong-li-880728-13425628.jpg"
                    alt="Card 3"
                    className="rounded-2xl mt-4 w-full h-full object-cover"
                  />
                </div>
              </Card>
            </CardSwap>
          </div>

        </div>
      </div>
    </>
  );
};
