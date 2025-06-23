
// pages/dashboard.tsx
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function Dashboaard() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white text-green-800 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold italic">MENU</h1>
        <div className="text-yellow-600 text-xl">🔔</div>
      </div>

      {/* Profile */}
      <div className="bg-gray-100 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Prakash M</h2>
            <p className="text-sm text-gray-600">Intermediate Player</p>
          </div>
          <Image
            src="/profile.jpg" // replace with your profile image path
            alt="Profile"
            className="rounded-full"
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* My Playmates */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">My Playmates</h3>
          <button className="text-sm text-green-700">View All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto">
          {['Sara', 'Donald', 'Smith', 'Monaxial', 'Jams'].map((name, index) => (
            <div key={index} className="text-center">
              <Image
                src={`/images/players/${name.toLowerCase()}.jpeg`} // e.g., /players/sara.jpg
                alt={name}
                width={50}
                height={50}
                className="rounded-full mx-auto"
              />
              <p className="text-xs mt-1">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-2 gap-4 cursor-pointer">
        {[
          { title: 'My Playmates', icon: '🎾' },
          { title: 'My Matches', icon: '🌐' },
          { title: 'Find Courts', icon: '🗺️' },
          { title: 'Find Programs', icon: '📍' },
          { title: 'Find players', icon: '🔍' },
          { title: 'My calendar', icon: '📅' },
          { title: 'Add availability', icon: '📆' },
          { title: 'Player Profile', icon: '📝' }
        ].map((item, index) => (
          <div key={index} className="p-4 bg-green-100 border border-green-200 rounded-lg shadow-sm text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
