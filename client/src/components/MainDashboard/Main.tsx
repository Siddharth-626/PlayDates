import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FiUsers, FiMapPin, FiSearch, FiCalendar, FiBell,
} from "react-icons/fi";
import {
    HomeIcon, MessageCircle, Trophy, Sun, Moon, X, Menu,
    ChevronLeft, Settings, LogOut,
} from "lucide-react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

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
import { auth } from "@/services/config";
import { useTheme } from "@/context/ThemeContext";

// ─── Sidebar navigation definition ─────────────────────────────────────────

const NAV_ITEMS = [
    { label: "Home",          icon: HomeIcon,      tab: "Home" },
    { label: "Find Players",  icon: FiSearch,      tab: "Find Players" },
    { label: "My Matches",    icon: Trophy,        tab: "My Matches" },
    { label: "My Playmates",  icon: FiUsers,       tab: "My Playmates" },
    { label: "My Calendar",   icon: FiCalendar,    tab: "My Calendar" },
    { label: "Find Courts",   icon: FiMapPin,      tab: "Find Courts" },
    { label: "Notifications", icon: FiBell,        tab: "Notifications" },
] as const;

type TabKey = (typeof NAV_ITEMS)[number]["tab"] | "Messages" | "Player Profile" | "Create Match";

// ─── Sidebar collapse width constants ───────────────────────────────────────
const SIDEBAR_W_EXPANDED  = 240; // px
const SIDEBAR_W_COLLAPSED = 68;  // px

// ─── Profile dropdown (inside sidebar) — shows GOOGLE ACCOUNT ──────────────

function SidebarProfileDropdown({ collapsed }: { collapsed: boolean }) {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handle = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out");
            router.push("/login");
        } catch {
            toast.error("Logout failed");
        }
    };

    if (!user) return null;

    const avatarSrc = user.photoURL || "/images/players/defaultProfilePhoto.jpg";
    const accountName = user.displayName || user.email?.split("@")[0] || "Account";
    const accountEmail = user.email || "";

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-3 w-full p-2.5 rounded-xl
                            hover:bg-[var(--surface-inset)] transition-colors
                            ${collapsed ? "justify-center" : ""}`}
                aria-label="Account menu"
            >
                <Image
                    src={avatarSrc}
                    alt={accountName}
                    width={34}
                    height={34}
                    className="rounded-full object-cover shrink-0 ring-2 ring-[var(--border-subtle)]"
                />
                {!collapsed && (
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-semibold text-[var(--content-primary)] truncate leading-tight">
                            {accountName}
                        </p>
                        <p className="text-[11px] text-[var(--content-muted)] truncate">
                            {accountEmail}
                        </p>
                        {/* item 2: show active player profile below account info */}
                        {selectedProfile && (
                            <p className="text-[10px] text-[var(--accent-green)] truncate mt-0.5">
                                Profile: <span className="font-semibold">{selectedProfile.name}</span>
                            </p>
                        )}
                    </div>
                )}
            </button>

            {open && (
                <div
                    className={`absolute z-50 bottom-full mb-2 w-56
                                bg-[var(--surface-overlay)] border border-[var(--border-subtle)]
                                rounded-xl shadow-dropdown overflow-hidden animate-scale-in
                                ${collapsed ? "left-full ml-2 bottom-0" : "left-0"}`}
                >
                    <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                        <p className="text-[13px] font-semibold text-[var(--content-primary)] truncate">{accountName}</p>
                        <p className="text-[11px] text-[var(--content-muted)] truncate">{accountEmail}</p>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={() => { setOpen(false); router.push("/settings"); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px]
                                       text-[var(--content-secondary)] hover:bg-[var(--surface-inset)]
                                       hover:text-[var(--content-primary)] transition-colors"
                        >
                            <Settings className="w-4 h-4 text-[var(--content-muted)]" />
                            Settings
                        </button>
                    </div>

                    <div className="border-t border-[var(--border-subtle)] py-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px]
                                       text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const Dashboard = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabKey>("Home");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const { matches } = useMatchs();
    const { notifications, setNotifications } = useFetchNotifications({
        userUid: user?.uid,
        profileId: selectedProfile?.id,
    });

    useEffect(() => {
        if (!selectedProfile?.userUid || !selectedProfile?.id) return;
        const unsub = listenToChats(
            selectedProfile.userUid,
            selectedProfile.id,
            (updatedChats) => setChats(updatedChats)
        );
        return unsub;
    }, [selectedProfile?.userUid, selectedProfile?.id]);

    const unreadMessages    = useMemo(() => chats.reduce((s, c) => s + (c.unSeenMessages || 0), 0), [chats]);
    const unreadNotifications = useMemo(() => notifications?.filter((n) => !n.isRead).length || 0, [notifications]);
    const unreadMatches     = useMemo(() => matches?.filter((n) => !n.isRead).length || 0, [matches]);

    const sidebarW = sidebarCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED;

    const getBadge = useCallback((tab: string) => {
        if (tab === "Notifications" && unreadNotifications > 0) return unreadNotifications;
        if (tab === "My Matches"    && unreadMatches > 0)       return unreadMatches;
        return null;
    }, [unreadNotifications, unreadMatches]);

    const renderContent = useCallback(() => {
        switch (activeTab) {
            case "Messages":      return <ChatDashBoard />;
            case "Home":          return <HomeTab setTab={(t) => setActiveTab(t as TabKey)} />;
            case "My Playmates":  return <DisplayPlaymates />;
            case "My Matches":    return <DisplayMatches matches={matches} />;
            case "Find Courts":   return <DisplayCourts />;
            case "Find Players":  return <FindPlayers />;
            case "My Calendar":   return <DisplayAvailability />;
            case "Player Profile":return <PlayerProfileDropdown />;
            case "Notifications": return <NotificationTab notifications={notifications} setNotifications={setNotifications} />;
            default:              return null;
        }
    }, [activeTab, matches, notifications, setNotifications]);

    // ── Full-height Sidebar (desktop) ─────────────────────────────────────
    const FloatingSidebar = (
        <aside
            className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 flex-col
                       bg-[var(--sidebar-bg)] border-r border-[var(--border-subtle)]
                       shadow-sidebar overflow-hidden
                       transition-all duration-300 ease-in-out"
            style={{ width: sidebarW }}
            aria-label="Main navigation"
        >
            {/* ── Logo ────────────────────────────────────────────── */}
            <div className={`flex items-center h-[60px] shrink-0 px-3 border-b border-[var(--border-subtle)]
                            ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
                {sidebarCollapsed ? (
                    /* Collapsed: green pill icon */
                    <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="w-10 h-10 rounded-xl bg-[var(--accent-green)] flex items-center justify-center shadow-glow-green hover:opacity-90 transition-opacity"
                        aria-label="Expand sidebar"
                        title="Expand sidebar"
                    >
                        <span className="text-white font-black text-[16px] leading-none select-none">P</span>
                    </button>
                ) : (
                    <>
                        {/* Expanded: icon + wordmark */}
                        <button
                            onClick={() => setActiveTab("Home")}
                            className="flex items-center gap-2.5 min-w-0"
                            aria-label="Go to home"
                        >
                            <div className="w-7 h-7 rounded-lg bg-[var(--accent-green)] flex items-center justify-center shrink-0 shadow-sm">
                                <span className="text-white font-black text-[14px] leading-none select-none">P</span>
                            </div>
                            <span className="font-outfit font-bold text-[16px] text-[var(--content-primary)] tracking-tight truncate">
                                Playdates
                            </span>
                        </button>
                        <button
                            onClick={() => setSidebarCollapsed(true)}
                            className="p-1.5 rounded-lg hover:bg-[var(--surface-inset)] transition-colors text-[var(--content-muted)] shrink-0 ml-1"
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>

            {/* ── Player Profile mini-card ─────────────────────────── */}
            {selectedProfile && (
                <button
                    onClick={() => setActiveTab("Player Profile")}
                    className={`mx-3 mt-3 flex items-center gap-2.5 p-2.5 rounded-xl border transition-all
                                hover:border-[var(--accent-green)]/50 hover:bg-[var(--surface-inset)]
                                ${sidebarCollapsed ? "justify-center border-transparent" : "border-[var(--border-subtle)]"}
                                bg-[var(--surface-overlay)]`}
                    title={sidebarCollapsed ? selectedProfile.name : undefined}
                    aria-label="Go to player profile"
                >
                    <div className="relative shrink-0">
                        {selectedProfile.photoUrl ? (
                            <img
                                src={selectedProfile.photoUrl}
                                alt={selectedProfile.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--accent-green)]"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[var(--surface-inset)] ring-2 ring-[var(--accent-green)] flex items-center justify-center">
                                <FiUsers className="w-4 h-4 text-[var(--accent-green)]" />
                            </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] border-2 border-[var(--surface-overlay)]" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[12px] font-semibold text-[var(--content-primary)] truncate leading-tight">{selectedProfile.name}</p>
                            <p className="text-[10px] text-[var(--accent-green)] font-medium truncate">Player Profile</p>
                        </div>
                    )}
                </button>
            )}

            {/* ── Navigation ──────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-2 space-y-1">
                {NAV_ITEMS.map(({ label, icon: Icon, tab }) => {
                    const isActive = activeTab === tab;
                    const badge    = getBadge(tab);
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            title={sidebarCollapsed ? label : undefined}
                            className={`relative flex items-center w-full h-12 transition-all duration-150
                                        ${sidebarCollapsed ? "justify-center px-0" : "gap-3 px-4"}
                                        ${isActive
                                            ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10"
                                            : "text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)]"
                                        }`}
                            style={{ margin: '0 8px', width: 'calc(100% - 16px)', borderRadius: '10px' }}
                            aria-label={label}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--accent-green)] rounded-r-full" />
                            )}
                            <Icon className="w-[19px] h-[19px] shrink-0" />
                            {!sidebarCollapsed && (
                                <>
                                    <span className="flex-1 text-left text-[15px] font-medium truncate">{label}</span>
                                    {badge !== null && (
                                        <span className="min-w-[20px] h-[20px] px-1.5 flex items-center justify-center
                                                         text-[10px] font-bold bg-red-500 text-white rounded-full">
                                            {badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}

                {/* Divider */}
                <div className="my-2 mx-4 border-t border-[var(--border-subtle)]" />

                {/* Messages */}
                <button
                    onClick={() => setActiveTab("Messages")}
                    title={sidebarCollapsed ? "Messages" : undefined}
                    className={`relative flex items-center w-full h-12 transition-all duration-150
                                ${sidebarCollapsed ? "justify-center" : "gap-3 px-4"}
                                ${activeTab === "Messages"
                                    ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10"
                                    : "text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)]"
                                }`}
                    style={{ margin: '0 8px', width: 'calc(100% - 16px)', borderRadius: '10px' }}
                >
                    {activeTab === "Messages" && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--accent-green)] rounded-r-full" />
                    )}
                    {/* item 1 & 35: badge visible in both collapsed and expanded states */}
                    <div className="relative shrink-0">
                        <MessageCircle className="w-[19px] h-[19px]" />
                        {sidebarCollapsed && unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold bg-red-500 text-white rounded-full border border-[var(--sidebar-bg)]">
                                {unreadMessages > 9 ? "9+" : unreadMessages}
                            </span>
                        )}
                    </div>
                    {!sidebarCollapsed && (
                        <>
                            <span className="flex-1 text-left text-[15px] font-medium">Messages</span>
                            {unreadMessages > 0 && (
                                <span className="min-w-[20px] h-[20px] px-1.5 flex items-center justify-center
                                                 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                    {unreadMessages > 9 ? "9+" : unreadMessages}
                                </span>
                            )}
                        </>
                    )}
                </button>


            </nav>

            {/* ── Theme Toggle ─────────────────────────────────────── */}
            <div className="px-2 pb-1">
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    className={`flex items-center w-full h-10 rounded-[10px] transition-all duration-150
                                text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)]
                                ${sidebarCollapsed ? 'justify-center' : 'gap-3 px-4'}`}
                >
                    {theme === 'dark'
                        ? <Sun className="w-[18px] h-[18px] shrink-0" />
                        : <Moon className="w-[18px] h-[18px] shrink-0" />}
                    {!sidebarCollapsed && (
                        <span className="text-[14px] font-medium">Toggle theme</span>
                    )}
                </button>
            </div>

            {/* ── Account Section ──────────────────────────────────── */}
            <div className="shrink-0 p-3 border-t border-[var(--border-subtle)]">
                {!sidebarCollapsed ? (
                    <div className="bg-[var(--surface-overlay)] rounded-[10px] p-2">
                        <SidebarProfileDropdown collapsed={false} />
                    </div>
                ) : (
                    <SidebarProfileDropdown collapsed={true} />
                )}
            </div>
        </aside>
    );

    // ── Mobile drawer ──────────────────────────────────────────────────────
    const MobileDrawer = (
        <>
            {mobileDrawerOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileDrawerOpen(false)}
                />
            )}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 md:hidden
                            bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]
                            flex flex-col shadow-sidebar
                            transition-transform duration-300 ease-in-out
                            ${mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border-subtle)] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[var(--accent-green)] flex items-center justify-center shrink-0">
                            <span className="text-white font-black text-[14px] leading-none select-none">P</span>
                        </div>
                        <span className="font-outfit font-bold text-[16px] text-[var(--content-primary)] tracking-tight">Playdates</span>
                    </div>
                    <button
                        onClick={() => setMobileDrawerOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-[var(--surface-inset)] transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 text-[var(--content-muted)]" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                    {NAV_ITEMS.map(({ label, icon: Icon, tab }) => {
                        const isActive = activeTab === tab;
                        const badge    = getBadge(tab);
                        return (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setMobileDrawerOpen(false); }}
                                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all
                                            ${isActive
                                                ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                                                : "text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)]"
                                            }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="flex-1 text-[15px] font-medium text-left">{label}</span>
                                {badge !== null && (
                                    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                                        {badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    <div className="my-2 border-t border-[var(--border-subtle)]" />

                    <button
                        onClick={() => { setActiveTab("Messages"); setMobileDrawerOpen(false); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all
                                    ${activeTab === "Messages"
                                        ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                                        : "text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)]"
                                    }`}
                    >
                        <div className="relative"><MessageCircle className="w-5 h-5" />
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
                                    {unreadMessages}
                                </span>
                            )}
                        </div>
                        <span className="text-body font-medium">Messages</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mt-1
                                   text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-inset)] transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="text-body font-medium">Toggle theme</span>
                    </button>
                </nav>

                <div className="shrink-0 px-2 py-3 border-t border-[var(--border-subtle)]">
                    <SidebarProfileDropdown collapsed={false} />
                </div>
            </aside>
        </>
    );

    // ── Mobile top bar ─────────────────────────────────────────────────────
    const MobileTopBar = (
        <header className="fixed top-0 left-0 right-0 z-40 h-14 md:hidden
                           bg-[var(--surface-raised)] border-b border-[var(--border-subtle)]
                           flex items-center justify-between px-4">
            <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 rounded-xl hover:bg-[var(--surface-inset)] transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5 text-[var(--content-secondary)]" />
            </button>

            <button onClick={() => setActiveTab("Home")} className="flex items-center gap-2.5" aria-label="Go to home">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-green)] flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-[14px] leading-none select-none">P</span>
                </div>
                <span className="font-outfit font-bold text-[16px] text-[var(--content-primary)] tracking-tight">Playdates</span>
            </button>

            <button
                onClick={() => setActiveTab("Messages")}
                className="relative p-2 rounded-xl hover:bg-[var(--surface-inset)] transition-colors"
                aria-label="Messages"
            >
                <MessageCircle className="w-5 h-5 text-[var(--content-secondary)]" />
                {unreadMessages > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
                        {unreadMessages}
                    </span>
                )}
            </button>
        </header>
    );

    // ── Mobile bottom nav ──────────────────────────────────────────────────
    const MOBILE_NAV = [
        { tab: "Home"         as TabKey, label: "Home",    Icon: HomeIcon },
        { tab: "Find Players" as TabKey, label: "Find",    Icon: FiSearch },
        { tab: "My Matches"   as TabKey, label: "Matches", Icon: Trophy },
        { tab: "My Calendar"  as TabKey, label: "Calendar",Icon: FiCalendar },
        { tab: "Notifications"as TabKey, label: "Alerts",  Icon: FiBell },
    ];

    const MobileBottomNav = (
        <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 h-16
                        bg-[var(--surface-raised)] border-t border-[var(--border-subtle)]
                        flex items-center justify-around px-2">
            {MOBILE_NAV.map(({ tab, label, Icon }) => {
                const isActive = activeTab === tab;
                const badge    = getBadge(tab);
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all
                                    ${isActive ? "text-[var(--accent-green)]" : "text-[var(--content-muted)]"}`}
                    >
                        <div className="relative">
                            {badge !== null && (
                                <span className="absolute -top-1 -right-1 min-w-[13px] h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold bg-red-500 text-white rounded-full">
                                    {badge}
                                </span>
                            )}
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium">{label}</span>
                    </button>
                );
            })}
        </nav>
    );

    return (
        <div className="flex min-h-screen bg-[var(--surface-base)]">
            {/* Sidebar (desktop floating) */}
            {FloatingSidebar}

            {/* Mobile drawer + top bar + bottom nav */}
            {MobileDrawer}
            {MobileTopBar}
            {MobileBottomNav}

            {/* ── Main content ────────────────────────────────────── */}
            <main
                className="flex-1 min-h-screen pt-14 md:pt-0 pb-16 md:pb-0 transition-all duration-300"
                style={{ marginLeft: `${sidebarW}px` }}
            >
                <div
                    className="w-full h-full"
                    style={{ display: "none" }}
                    // Reserve space on mobile (sidebar is in the DOM but hidden)
                />
                {/* Remove inline margin on mobile via Tailwind override */}
                <style>{`
                    @media (max-width: 767px) {
                        main { margin-left: 0 !important; }
                    }
                `}</style>
                <div className="w-full min-h-screen">{renderContent()}</div>
            </main>
        </div>
    );
};

export default Dashboard;
