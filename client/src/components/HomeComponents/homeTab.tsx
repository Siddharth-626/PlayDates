import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell, User, Users, Calendar, MapPin, Trophy,
  ChevronRight, MessageCircle, Search, Star,
  TrendingUp, Clock, Zap, Activity, Target,
} from "lucide-react";
import { useProfile } from "@/context/profileContext";
import { useFetchNotifications } from "@/hooks/useFetchNotifications";
import { usePlaymates } from "@/context/playmatesContext";
import { useMatchs } from "@/context/matchContext";
import { useAuth } from "@/context/authContext";
import { SkillBasedTennisBallsUi } from "@/components/ui/SkillTennisBalls";
import { getMatchCalendarDate, isUpcomingMatch } from "@/utils/Match/matchDate";

const SKILL_LABELS: Record<string, string> = {
  "1.0 - 1.5": "Beginner",
  "2.0 - 2.5": "Novice",
  "3.0 - 3.5": "Intermediate",
  "4.0 - 4.5": "Advanced",
  "5.0": "Expert",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HomeTab({ setTab }: { setTab: (tab: string) => void }) {
  const { user }            = useAuth();
  const { selectedProfile } = useProfile();
  const { matches }         = useMatchs();
  const { notifications }   = useFetchNotifications({ userUid: user?.uid, profileId: selectedProfile?.id });
  const { playmates }       = usePlaymates();

  const unreadNotifications = notifications?.filter((n) => !n.isRead).length || 0;

  // Upcoming = accepted matches whose calendar day is today or in the future.
  // Uses full date+time so already-ended matches from today are not counted.
  const upcomingMatchesList = useMemo(() => {
    const now = new Date();
    return matches?.filter((m) => isUpcomingMatch(m, now)) || [];
  }, [matches]);

  const upcomingMatches = upcomingMatchesList.length;
  const pendingMatches  = matches?.filter((m) => m.status === "pending").length || 0;
  const playmatesLength = playmates?.length || 0;
  const totalMatches    = matches?.length || 0;
  const skillLabel      = selectedProfile?.skill ? SKILL_LABELS[selectedProfile.skill] || selectedProfile.skill : null;

  // Nearest upcoming match date (soonest first)
  const nextMatchDate = useMemo(() => {
    if (!upcomingMatchesList.length) return null;
    const withDate = upcomingMatchesList
      .map((m) => ({ m, t: getMatchCalendarDate(m)?.getTime() ?? Infinity }))
      .filter(({ t }) => t !== Infinity)
      .sort((a, b) => a.t - b.t);
    return withDate.length ? getMatchCalendarDate(withDate[0].m) : null;
  }, [upcomingMatchesList]);

  const nextMatchLabel = nextMatchDate
    ? nextMatchDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    : null;

  // Semantic colors per item 6
  const stats = [
    {
      label: "Playmates",
      value: playmatesLength,
      icon: Users,
      color: "text-[var(--accent-green)]",
      bg: "bg-[var(--accent-green)]/10",
      tab: "My Playmates",
      urgent: false,
    },
    {
      label: "Upcoming",
      value: upcomingMatches,
      icon: Calendar,
      color: "text-[var(--accent-gold)]",
      bg: "bg-[var(--accent-gold)]/10",
      tab: "My Matches",
      urgent: false,
    },
    {
      label: "Pending",
      value: pendingMatches,
      icon: Clock,
      color: pendingMatches > 0 ? "text-[var(--accent-gold)]" : "text-[var(--content-muted)]",
      bg: pendingMatches > 0 ? "bg-[var(--accent-gold)]/10" : "bg-[var(--surface-inset)]",
      tab: "My Matches",
      urgent: pendingMatches > 0,
    },
    {
      label: "Alerts",
      value: unreadNotifications,
      icon: Bell,
      color: unreadNotifications > 0 ? "text-red-400" : "text-[var(--accent-green)]",
      bg: unreadNotifications > 0 ? "bg-red-400/10" : "bg-[var(--accent-green)]/10",
      tab: "Notifications",
      urgent: unreadNotifications > 0,
    },
    {
      label: "Total Played",
      value: totalMatches,
      icon: Trophy,
      color: "text-[var(--accent-green)]",
      bg: "bg-[var(--accent-green)]/10",
      tab: "My Matches",
      urgent: false,
    },
    {
      label: "Win Rate",
      value: totalMatches > 0 ? "—" : "—",
      icon: TrendingUp,
      color: "text-[var(--accent-green)]",
      bg: "bg-[var(--accent-green)]/10",
      tab: "My Matches",
      urgent: false,
      subtitle: totalMatches === 0 ? "No matches yet" : "Track matches to see",
    },
  ];

  // Trimmed to 3 most-used actions (item 8)
  const quickActions = [
    { label: "Find Players", icon: Search,        tab: "Find Players",  color: "text-[var(--accent-green)]",  bg: "bg-[var(--accent-green)]/10",  desc: "Discover partners" },
    { label: "My Matches",   icon: Trophy,        tab: "My Matches",    color: "text-[var(--accent-gold)]",   bg: "bg-[var(--accent-gold)]/10",    desc: "View & create" },
    { label: "Messages",     icon: MessageCircle, tab: "Messages",      color: "text-purple-400",             bg: "bg-purple-400/10",              desc: "Chat with players" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--accent-green)20 0%, var(--surface-raised) 50%, var(--surface-overlay) 100%)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-8 md:px-10 md:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: profile info */}
            <div className="flex items-center gap-5">
              {/* Avatar — no green ring (item 9) */}
              <button
                onClick={() => setTab("Player Profile")}
                className="relative shrink-0 group"
                aria-label="View player profile"
              >
                {selectedProfile?.photoUrl ? (
                  <img
                    src={selectedProfile.photoUrl}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--border-subtle)] group-hover:border-[var(--accent-green)] transition-all shadow-lg"
                    alt={selectedProfile.name}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[var(--surface-inset)] border-2 border-[var(--border-subtle)] flex items-center justify-center shadow-lg">
                    <User className="w-9 h-9 text-[var(--content-muted)]" />
                  </div>
                )}
                {/* Online indicator dot only */}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[var(--accent-green)] border-2 border-[var(--surface-raised)]" />
              </button>

              <div>
                <p className="text-[13px] font-medium text-[var(--content-muted)] mb-0.5">Welcome back</p>
                <h1 className="font-outfit text-[24px] md:text-[28px] font-bold text-[var(--content-primary)] leading-tight">
                  {selectedProfile?.name || "Set up your profile"}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {selectedProfile?.age && selectedProfile?.gender && (
                    <span className="text-[13px] text-[var(--content-muted)]">
                      {selectedProfile.age} · {selectedProfile.gender}
                    </span>
                  )}
                  {skillLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] text-[11px] font-semibold">
                      <Star className="w-3 h-3" /> {skillLabel}
                    </span>
                  )}
                  {selectedProfile?.skill && <SkillBasedTennisBallsUi skill={selectedProfile.skill} />}
                </div>
              </div>
            </div>

            {/* Right: urgent action */}
            {pendingMatches > 0 && (
              <button
                onClick={() => setTab("My Matches")}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/15 transition-all shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[var(--accent-gold)]" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-bold text-[var(--accent-gold)]">{pendingMatches} Pending</p>
                  <p className="text-[11px] text-[var(--content-muted)]">Match invites waiting</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--accent-gold)]" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-5 py-6 md:px-10 md:py-8 space-y-8">

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-[0.1em] mb-4">Your Stats</p>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((card) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.label}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTab(card.tab)}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border text-center transition-all bg-[var(--card-bg)] hover:shadow-card
                    ${card.urgent ? "border-[var(--accent-gold)]/40 shadow-sm" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}
                >
                  {card.urgent && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className={`text-2xl font-outfit font-bold leading-none ${card.color}`}>{card.value}</p>
                  <p className="mt-1.5 text-[11px] text-[var(--content-muted)] font-medium leading-tight">{card.label}</p>
                  {(card as any).subtitle && (
                    <p className="text-[10px] text-[var(--content-muted)] opacity-70 leading-tight mt-0.5">{(card as any).subtitle}</p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Quick Actions (top 3 most useful) ───────────────────────── */}
        <motion.section variants={itemVariants}>
          <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-[0.1em] mb-4">Quick Access</p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ label, icon: Icon, tab, color, bg, desc }) => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTab(tab)}
                className="flex flex-col items-center justify-center gap-2.5 p-5 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--border-default)] hover:shadow-card transition-all group"
                style={{ minHeight: 110 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[var(--content-primary)] leading-tight">{label}</p>
                  <p className="text-[11px] text-[var(--content-muted)] mt-0.5">{desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ── Activity Summary ─────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-[0.1em] mb-4">Activity</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Upcoming match highlight */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab("My Matches")}
              className="sm:col-span-2 flex items-center gap-4 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-[var(--accent-green)]/40 hover:shadow-card transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-green)]/10 flex items-center justify-center shrink-0">
                <Activity className="w-7 h-7 text-[var(--accent-green)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[var(--content-primary)]">
                  {upcomingMatches > 0
                    ? `${upcomingMatches} upcoming match${upcomingMatches !== 1 ? "es" : ""}`
                    : "No upcoming matches"}
                </p>
                {/* Context subtitle (item 7) */}
                <p className="text-[12px] text-[var(--content-muted)] mt-0.5">
                  {nextMatchLabel
                    ? `Next: ${nextMatchLabel}`
                    : upcomingMatches > 0
                      ? "Tap to view your schedule"
                      : "Create a match to get started"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--content-muted)] shrink-0" />
            </motion.button>

            {/* Playmates highlight */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab("My Playmates")}
              className="flex items-center gap-4 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-[var(--accent-green)]/40 hover:shadow-card transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-green)]/10 flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 text-[var(--accent-green)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[var(--content-primary)]">{playmatesLength} Playmates</p>
                {/* Context subtitle (item 7) */}
                <p className="text-[12px] text-[var(--content-muted)] mt-0.5">
                  {playmatesLength > 0 ? "View your network" : "Add players to connect"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--content-muted)] shrink-0" />
            </motion.button>
          </div>
        </motion.section>

      </div>
    </motion.div>
  );
}
