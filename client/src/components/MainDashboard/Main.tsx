import { useEffect, useState } from "react";
import {
    FiUsers,
    FiMapPin,
    FiSearch,
    FiCalendar,
    FiUser,
    FiBell,
} from "react-icons/fi";
import { HomeIcon, X, MessageCircle, Menu, Trophy } from "lucide-react";
import PlayerProfileDropdown from "../profile/ViewProfile/PlayerProfile";
import { FindPlayers } from "../FindPlayers/Main";
import { NotificationTab } from "../notifications/notification";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { DisplayPlaymates } from "../Playmates/displayPlaymates/Main";
import { DisplayAvailability } from "../availability/displayAvailability/displayAvailability";
import { DisplayCourts } from "../courts/displayCourts/court";
import { DisplayMatches } from "../MyMatches/match";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import HomeTab from "../HomeComponents/homeTab";
import { useMatchs } from "@/context/matchContext";
import { ChatDashBoard } from "../chat/chatDashBoard";
import { listenToChats } from "@/utils/chat/listenToChats";

const SIDEBAR_ITEMS = [
    { label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "My Playmates", icon: <FiUsers className="w-5 h-5" /> },
    { label: "My Matches", icon: <Trophy className="w-5 h-5" /> },
    { label: "My Calendar", icon: <FiCalendar className="w-5 h-5" /> },
    { label: "Find Courts", icon: <FiMapPin className="w-5 h-5" /> },
    { label: "Find Players", icon: <FiSearch className="w-5 h-5" /> },
    { label: "Notifications", icon: <FiBell className="w-5 h-5" /> },
    { label: "Player Profile", icon: <FiUser className="w-5 h-5" /> },
];

const BOTTOM_NAV_ITEMS = [
    { label: "Home", shortLabel: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "My Playmates", shortLabel: "Playmates", icon: <FiUsers className="w-5 h-5" /> },
    { label: "My Matches", shortLabel: "Matches", icon: <Trophy className="w-5 h-5" /> },
    { label: "My Calendar", shortLabel: "Calendar", icon: <FiCalendar className="w-5 h-5" /> },
    { label: "Find Courts", shortLabel: "Courts", icon: <FiMapPin className="w-5 h-5" /> },
];

const Dashboard = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [activeTab, setActiveTab] = useState("Home");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const { matches } = useMatchs();
    const { notifications, setNotifications } = useFetchNotifications({
        userUid: user?.uid,
        profileId: selectedProfile?.id,
    });

    // Listen to chats for unread badge count in header
    useEffect(() => {
        if (!selectedProfile?.userUid || !selectedProfile?.id) return;
        const unsub = listenToChats(
            selectedProfile.userUid,
            selectedProfile.id,
            (updatedChats) => setChats(updatedChats)
        );
        return unsub;
    }, [selectedProfile?.userUid, selectedProfile?.id]);

    const unreadMessages = chats.reduce((sum, c) => sum + (c.unSeenMessages || 0), 0);
    const unreadNotifications = notifications?.filter((n) => !n.isRead).length || 0;
    const unreadMatches = matches?.filter((n) => !n.isRead).length || 0;

    const getItemBadge = (label: string) => {
        if (label === "Notifications" && unreadNotifications > 0) {
            return (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {unreadNotifications}
                </span>
            );
        }
        if (label === "My Matches" && unreadMatches > 0) {
            return (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {unreadMatches}
                </span>
            );
        }
        return null;
    };

    const getBottomBadge = (label: string) => {
        if (label === "Notifications" && unreadNotifications > 0) {
            return (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold bg-red-500 text-white rounded-full">
                    {unreadNotifications}
                </span>
            );
        }
        if (label === "My Matches" && unreadMatches > 0) {
            return (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold bg-red-500 text-white rounded-full">
                    {unreadMatches}
                </span>
            );
        }
        return null;
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Messages":
                return <ChatDashBoard />;
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
                return (
                    <NotificationTab
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0d1b2a] text-white">
            {/* ── Top header ────────────────────────────────────────── */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0d1b2a] border-b border-[#1e3040] flex items-center justify-between px-4 md:pl-[272px]">
                <button
                    onClick={() => setActiveTab("Home")}
                    className="flex items-center gap-2 group"
                >
                    <HomeIcon className="w-5 h-5 text-[#22c55e]" />
                    <span className="font-bold text-white text-lg tracking-tight">
                        Playdates
                    </span>
                </button>

                <div className="flex items-center gap-1">
                    {/* Messages icon with unread badge */}
                    <button
                        onClick={() => setActiveTab("Messages")}
                        className="relative p-2.5 rounded-xl hover:bg-[#1a2a3a] transition-colors"
                        aria-label="Messages"
                    >
                        <MessageCircle className="w-5 h-5 text-white" />
                        {unreadMessages > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full leading-none">
                                {unreadMessages}
                            </span>
                        )}
                    </button>

                    {/* Hamburger — always visible on mobile, visible on desktop too */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2.5 rounded-xl hover:bg-[#1a2a3a] transition-colors md:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </button>
                </div>
            </header>

            {/* ── Drawer overlay (mobile) ────────────────────────────── */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* ── Slide-in sidebar drawer (mobile) ────────────────────── */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 bg-[#0a1628] border-r border-[#1e3040] flex flex-col transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-5 h-14 border-b border-[#1e3040] shrink-0">
                    <span className="font-bold text-white text-base">Navigation</span>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-[#1a2a3a] transition-colors"
                    >
                        <X className="w-4 h-4 text-[#94a3b8]" />
                    </button>
                </div>

                {/* Profile summary */}
                {selectedProfile && (
                    <div className="px-5 py-4 border-b border-[#1e3040] shrink-0">
                        <div className="flex items-center gap-3">
                            {selectedProfile.photoUrl ? (
                                <img
                                    src={selectedProfile.photoUrl}
                                    className="w-10 h-10 rounded-full border-2 border-[#22c55e] object-cover"
                                    alt={selectedProfile.name}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border-2 border-[#22c55e] bg-[#1a2a3a] flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-[#22c55e]" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <div className="text-white font-semibold text-sm truncate">
                                    {selectedProfile.name}
                                </div>
                                <div className="text-[#6b7280] text-xs">
                                    {selectedProfile.age} · {selectedProfile.gender}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {SIDEBAR_ITEMS.map(({ label, icon }) => {
                        const isActive = activeTab === label;
                        return (
                            <button
                                key={label}
                                onClick={() => {
                                    setActiveTab(label);
                                    setDrawerOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all border-l-[3px] ${
                                    isActive
                                        ? "bg-[#1a2a3a] border-[#22c55e] text-white"
                                        : "border-transparent text-[#94a3b8] hover:bg-[#1a2a3a] hover:text-white"
                                }`}
                            >
                                <span className={isActive ? "text-[#22c55e]" : "text-[#6b7280]"}>
                                    {icon}
                                </span>
                                <span className="text-sm font-medium flex-1">{label}</span>
                                {getItemBadge(label)}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* ── Desktop sidebar (always visible ≥ md) ─────────────────── */}
            <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 flex-col bg-[#0a1628] border-r border-[#1e3040] z-30">
                {/* Profile summary */}
                {selectedProfile && (
                    <div className="px-4 py-4 border-b border-[#1e3040] shrink-0">
                        <div className="flex items-center gap-3">
                            {selectedProfile.photoUrl ? (
                                <img
                                    src={selectedProfile.photoUrl}
                                    className="w-10 h-10 rounded-full border-2 border-[#22c55e] object-cover"
                                    alt={selectedProfile.name}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border-2 border-[#22c55e] bg-[#1a2a3a] flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-[#22c55e]" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <div className="text-white font-semibold text-sm truncate">
                                    {selectedProfile.name}
                                </div>
                                <div className="text-[#6b7280] text-xs">
                                    {selectedProfile.age} · {selectedProfile.gender}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto py-2">
                    {SIDEBAR_ITEMS.map(({ label, icon }) => {
                        const isActive = activeTab === label;
                        return (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-[3px] ${
                                    isActive
                                        ? "bg-[#1a2a3a] border-[#22c55e] text-white"
                                        : "border-transparent text-[#94a3b8] hover:bg-[#1a2a3a] hover:text-white"
                                }`}
                            >
                                <span className={isActive ? "text-[#22c55e]" : "text-[#6b7280]"}>
                                    {icon}
                                </span>
                                <span className="text-sm font-medium flex-1">{label}</span>
                                {getItemBadge(label)}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* ── Main content ──────────────────────────────────────────── */}
            <main className="flex-1 pt-14 md:pl-64 pb-16 md:pb-0 min-h-screen">
                <div className="w-full h-full">{renderContent()}</div>
            </main>

            {/* ── Bottom nav (mobile only) ──────────────────────────────── */}
            <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 h-16 bg-[#0d1b2a] border-t border-[#1e3040] flex items-center justify-around px-2">
                {BOTTOM_NAV_ITEMS.map(({ label, shortLabel, icon }) => {
                    const isActive = activeTab === label;
                    return (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                                isActive ? "text-[#22c55e]" : "text-[#6b7280]"
                            }`}
                        >
                            <span className="relative">
                                {getBottomBadge(label)}
                                {icon}
                            </span>
                            <span
                                className={`text-[10px] font-medium ${
                                    isActive ? "text-[#22c55e]" : "text-[#6b7280]"
                                }`}
                            >
                                {shortLabel}
                            </span>
                            {isActive && (
                                <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Dashboard;
