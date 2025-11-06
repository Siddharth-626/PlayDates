import { useEffect, useState } from "react";
import {
    FiUsers,
    FiGlobe,
    FiMapPin,
    FiMap,
    FiSearch,
    FiCalendar,
    FiEdit,
    FiUser,
    FiBell,
} from "react-icons/fi";
import { HomeIcon, icons, Send, X } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import PlayerProfileDropdown from "../profile/ViewProfile/PlayerProfile";
import { FindPlayers } from "../FindPlayers/Main";
import { NotificationTab } from "../notifications/notification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { DisplayPlaymates } from "../Playmates/displayPlaymates/Main";
import { DisplayAvailability } from "../availability/displayAvailability/displayAvailability";
import { DisplayCourts } from "../courts/displayCourts/court";
import { useFetchMatches } from "@/hooks/useFetchMatchs";
import { DisplayMatches } from "../MyMatches/match";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import HomeTab from "../HomeComponents/homeTab";
import { useMatchs } from "@/context/matchContext";
import { ChatDashBoard } from "../chat/chatDashBoard";

const NAV_ITEMS = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "My Playmates", icon: <FiUsers /> },
    { label: "My Matches", icon: <FiGlobe /> },
    { label: "My Calendar", icon: <FiCalendar /> },
    { label: "Messages", icon: <Send /> },
    { label: "Find Courts", icon: <FiMapPin /> },
    { label: "Find Players", icon: <FiSearch /> },
    { label: "Notifications", icon: <FiBell /> },

    { label: "Player Profile", icon: <FiUser /> },
];

const Dashboard = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [activeTab, setActiveTab] = useState("Home");
    const { matches } = useMatchs();
    const { notifications, setNotifications } = useFetchNotifications({ userUid: user?.uid, profileId: selectedProfile?.id });

    const renderContent = () => {
        switch (activeTab) {
            case "Messages":
                return <ChatDashBoard />
            case "Home":
                return <HomeTab setTab={setActiveTab} />;
            case "My Playmates":
                return <DisplayPlaymates />;
            case "My Matches":
                return <DisplayMatches matches={matches} />;
            case "Find Courts":
                return <DisplayCourts />;
            case "Find Players":
                return <FindPlayers />;
            case "My Calendar":
                return <DisplayAvailability />;
            case "Player Profile":
                return <PlayerProfileDropdown />;
            case "Notifications":
                return <NotificationTab notifications={notifications} setNotifications={setNotifications} />;
            default:
                return <div>Select an option</div>;
        }
    }; ``

    // Helper for notification/match badge
    const getBadge = (label: string) => {
        if (label === "Notifications" && notifications?.some(n => !n.isRead)) {
            return (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                    {notifications.filter(n => !n.isRead).length}
                </span>
            );
        }
        if (label === "My Matches" && matches?.some(n => !n.isRead)) {
            return (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                    {matches.filter(n => !n.isRead).length}
                </span>
            );
        }
        return null;
    };

    // Responsive sidebar: left on desktop, bottom on mobile
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
            {/* Sidebar for desktop */}
            <aside
                className={`hidden md:flex flex-col justify-between w-64 p-4 bg-white/90 dark:bg-gray-800 border-r rounded-3xl dark:border-gray-700 m-3 shadow-xl transition-all duration-500`}
            >
                <div>
                    <nav className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ label, icon }) => (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`relative flex  items-center gap-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                        ${activeTab === label
                                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                                        : "hover:bg-green-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    }`}
                            >
                                <span className="relative flex flex-col items-center">
                                    {getBadge(label)}
                                    <span className="text-2xl">{icon}</span>
                                </span>
                                <span className="text-sm mt-1">{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>


            {/* Main content */}
            <main className="flex-1 flex flex-col min-h-screen px-0  transition-all duration-500">
                {/* Content */}
                <div className="flex-1 w-full  mx-auto mt-2 md:mt-6">
                    {renderContent()}
                </div>
            </main>


            {/* Bottom nav for mobile */}
            <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 border-t border-green-200 dark:border-gray-700 flex justify-around items-center py-2 shadow-2xl rounded-t-2xl transition-all duration-500">
                {NAV_ITEMS.slice(0, 5).map(({ label, icon }) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(label)}
                        className={`relative flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-200
                ${activeTab === label
                                ? "text-green-600 dark:text-green-300 scale-110"
                                : "text-gray-500 dark:text-gray-300"
                            }`}
                    >
                        <span className="relative flex flex-col items-center">
                            {getBadge(label)}
                            <span className="text-2xl">{icon}</span>
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Dashboard;
