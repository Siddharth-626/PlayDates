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
import { X } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import PlayerProfileDropdown from "../profile/ViewProfile/PlayerProfile";
import { FindPlayers } from "../FindPlayers/Main";
import { NotificationTab } from "../notifications/notification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { FetchAllProfileNotification } from "@/utils/Notifications/FetchAllProfileNotification";
import { DisplayPlaymates } from "../Playmates/displayPlaymates/Main";
import { MatchPreposalNotificationType, NotificationsType } from "@/utils/TYPE";
import { DisplayAvailability } from "../availability/displayAvailability/displayAvailability";
import { DisplayCourts } from "../courts/displayCourts/court";

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
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [activeTab, setActiveTab] = useState("Player Profile");
    const [sideBar, setSideBar] = useState(true);
    const [notifications, setNotifications] = useState<NotificationsType[] | MatchPreposalNotificationType[]>([]);

    const fetchNotifications = async () => {
        if (user?.uid && selectedProfile?.id) {
            const data = await FetchAllProfileNotification({
                userUid: user.uid,
                profileId: selectedProfile.id
            });
            setNotifications(data);
        }
    }
    useEffect(() => {
        fetchNotifications()
    }, [user, selectedProfile])

    const renderContent = () => {
        switch (activeTab) {
            case "My Playmates":
                return <DisplayPlaymates />;
            case "My Matches":
                return <div>🌐 My Matches Component</div>;
            case "Find Courts":
                return <DisplayCourts />;
            case "Find Programs":
                return <div>📍 Find Programs Component</div>;
            case "Find Players":
                return <FindPlayers />;
            case "My Calendar":
                return <div>📅 My Calendar Component</div>;
            case "Add Availability":
                return <DisplayAvailability />;
            case "Player Profile":
                return <PlayerProfileDropdown />;
            case "Notifications":
                return <NotificationTab
                    notifications={notifications}
                    setNotifications={setNotifications}
                />
            default:
                return <div>Select an option</div>;
        }
    };
    const handleSidebarItemClick = (tabName:string) => {
        setActiveTab(tabName);
        if (window.innerWidth < 768) {   // If mobile
            setSideBar(false);
        }
    };
    return (
        <>
            <div className="flex min-h-screen bg-slate-200 dark:bg-gray-900 text-gray-900 dark:text-white">
                <aside
                    className={`fixed z-50 md:static transition-all duration-500 ease-in-out bg-slate-100 m-3 dark:bg-gray-800 border-r rounded-3xl dark:border-gray-700 ${sideBar ? 'w-64 p-4' : 'w-0 p-0'
                        } overflow-hidden h-full`}
                >
                    <div className={sideBar ? "block" : "None"}>
                        <div className="text-xl font-bold mb-4 flex justify-between">
                            <span>🎾 Playdates</span>
                            <button className="" onClick={() => setSideBar(false)}>
                                <X className="w-5 h-5 hover:text-red-600" />
                            </button>
                        </div>
                        <div className="flex flex-col h-screen justify-between">
                            <div>
                                <SidebarItem
                                    icon={<FiUsers />}
                                    label="My Playmates"
                                    isActive={activeTab === "My Playmates"}
                                    onClick={() => handleSidebarItemClick("My Playmates")}
                                />
                                <SidebarItem
                                    icon={<FiGlobe />}
                                    label="My Matches"
                                    isActive={activeTab === "My Matches"}
                                    onClick={() => handleSidebarItemClick("My Matches")}
                                />
                                <SidebarItem
                                    icon={<FiMapPin />}
                                    label="Find Courts"
                                    isActive={activeTab === "Find Courts"}
                                    onClick={() => handleSidebarItemClick("Find Courts")}
                                />
                                <SidebarItem
                                    icon={<FiMap />}
                                    label="Find Programs"
                                    isActive={activeTab === "Find Programs"}
                                    onClick={() => handleSidebarItemClick("Find Programs")}
                                />
                                <SidebarItem
                                    icon={<FiSearch />}
                                    label="Find Players"
                                    isActive={activeTab === "Find Players"}
                                    onClick={() => handleSidebarItemClick("Find Players")}
                                />
                                <SidebarItem
                                    icon={
                                        <div className="relative">
                                            <FiBell />
                                            {notifications.some(n => !n.isRead) && (
                                                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                                                    {notifications.filter(n => !n.isRead).length}
                                                </span>
                                            )}
                                        </div>
                                    }
                                    label="Notifications"
                                    isActive={activeTab === "Notifications"}
                                    onClick={() => handleSidebarItemClick("Notifications")}
                                />
                                <SidebarItem
                                    icon={<FiCalendar />}
                                    label="My Calendar"
                                    isActive={activeTab === "My Calendar"}
                                    onClick={() => handleSidebarItemClick("My Calendar")}
                                />
                                <SidebarItem
                                    icon={<FiEdit />}
                                    label="Add Availability"
                                    isActive={activeTab === "Add Availability"}
                                    onClick={() => handleSidebarItemClick("Add Availability")}
                                />
                                <SidebarItem
                                    icon={<FiUser />}
                                    label="Player Profile"
                                    isActive={activeTab === "Player Profile"}
                                    onClick={() => handleSidebarItemClick("Player Profile")}
                                />
                            </div>
                        </div>
                    </div>
                </aside>
                <main className={`flex-1 p-6 transition-all duration-500 ${sideBar ? "ml-0" : "ml-0"
                    } bg-slate-200 dark:bg-gray-900`}>
                    {!sideBar ? (<button className="" onClick={() => setSideBar(true)}><Bars3Icon className="w-5 h-5 text-gray-700 dark:text-white" /></button>) : (<></>)}
                    <div className="text-2xl font-semibold mb-4">{activeTab}</div>
                    <div className="p-4 bg-slate-200 dark:bg-gray-900">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
