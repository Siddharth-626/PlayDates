import { useState } from "react";
import {
    FiUsers,
    FiGlobe,
    FiMapPin,
    FiMap,
    FiSearch,
    FiCalendar,
    FiEdit,
    FiUser,
} from "react-icons/fi";
import Navbar from "../Navbar";
import { X } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import AvailabilitySelector from "../availability/AvailabilitySelector ";
import PlayerProfileDropdown from "../profile/ViewProfile/PlayerProfile";
import { FindPlayers } from "../FindPlayers/Main";

const SidebarItem = ({ icon, label, isActive, onClick }: any) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${isActive ? "bg-green-500 text-white dark:bg-green-700 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("My Playmates");
    const [sideBar, setSideBar] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case "My Playmates":
                return <div>🎾 My Playmates Component</div>;
            case "My Matches":
                return <div>🌐 My Matches Component</div>;
            case "Find Courts":
                return <div>🗺️ Find Courts Component</div>;
            case "Find Programs":
                return <div>📍 Find Programs Component</div>;
            case "Find Players":
                return <FindPlayers />;
            case "My Calendar":
                return <div>📅 My Calendar Component</div>;
            case "Add Availability":
                return <AvailabilitySelector />;
            case "Player Profile":
                return <PlayerProfileDropdown />;
            default:
                return <div>Select an option</div>;
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <aside
                    className={`transition-all duration-500 ease-in-out bg-gray-50 dark:bg-gray-800 border-r rounded-tr-3xl dark:border-gray-700 ${sideBar ? 'w-64 p-4' : 'w-0 p-0'
                        } overflow-hidden`}
                >
                    <div className={sideBar ? "block" : "None"}>
                        <div className="text-xl font-bold mb-4 flex justify-between">
                            <span>🎾 Playdates</span>
                            <button className="" onClick={() => setSideBar(false)}>
                                <X className="w-5 h-5 hover:text-red-600" />
                            </button>
                        </div>
                        <SidebarItem
                            icon={<FiUsers />}
                            label="My Playmates"
                            isActive={activeTab === "My Playmates"}
                            onClick={() => setActiveTab("My Playmates")}
                        />
                        <SidebarItem
                            icon={<FiGlobe />}
                            label="My Matches"
                            isActive={activeTab === "My Matches"}
                            onClick={() => setActiveTab("My Matches")}
                        />
                        <SidebarItem
                            icon={<FiMapPin />}
                            label="Find Courts"
                            isActive={activeTab === "Find Courts"}
                            onClick={() => setActiveTab("Find Courts")}
                        />
                        <SidebarItem
                            icon={<FiMap />}
                            label="Find Programs"
                            isActive={activeTab === "Find Programs"}
                            onClick={() => setActiveTab("Find Programs")}
                        />
                        <SidebarItem
                            icon={<FiSearch />}
                            label="Find Players"
                            isActive={activeTab === "Find Players"}
                            onClick={() => setActiveTab("Find Players")}
                        />
                        <SidebarItem
                            icon={<FiCalendar />}
                            label="My Calendar"
                            isActive={activeTab === "My Calendar"}
                            onClick={() => setActiveTab("My Calendar")}
                        />
                        <SidebarItem
                            icon={<FiEdit />}
                            label="Add Availability"
                            isActive={activeTab === "Add Availability"}
                            onClick={() => setActiveTab("Add Availability")}
                        />
                        <SidebarItem
                            icon={<FiUser />}
                            label="Player Profile"
                            isActive={activeTab === "Player Profile"}
                            onClick={() => setActiveTab("Player Profile")}
                        />
                    </div>
                </aside>
                <main className={`flex-1 p-6 transition-all duration-500 ${sideBar ? "ml-0" : "ml-0"
                    } bg-gray-100 dark:bg-gray-900`}>
                    {!sideBar ?(<button className="" onClick={()=> setSideBar(true)}><Bars3Icon  className="w-5 h-5 text-gray-700 dark:text-white"/></button>):(<></>)}
                    <div className="text-2xl font-semibold mb-4">{activeTab}</div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
