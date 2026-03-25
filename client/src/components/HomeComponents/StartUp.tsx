import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays, MapPin, Users, Trophy, Bell, MessageCircle,
  ArrowRight, Star, BarChart2, Globe2, ChevronRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

const FEATURES = [
  { icon: CalendarDays, label: "Schedule Matches",     desc: "Coordinate matches based on your availability." },
  { icon: MapPin,       label: "Find Nearby Players",  desc: "Connect with players around your location." },
  { icon: Trophy,       label: "Track Progress",       desc: "Log history and monitor your improvement." },
  { icon: Bell,         label: "Notifications",        desc: "Stay updated on invites and requests." },
  { icon: MessageCircle,label: "Direct Messaging",     desc: "Chat with playmates and plan matches." },
  { icon: BarChart2,    label: "Advanced Stats",       desc: "Analyze your match stats and skill level." },
  { icon: Users,        label: "Community",            desc: "Join a growing network of tennis players." },
  { icon: Globe2,       label: "Find Courts",          desc: "Discover and review courts near you." },
  { icon: Star,         label: "Skill Matching",       desc: "Get matched with players at your level." },
] as const;

const STATS = [
  { value: "10k+",  label: "Players" },
  { value: "500+",  label: "Courts" },
  { value: "50k+",  label: "Matches" },
];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
};

export const Startup = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--content-primary)]">
      {/* ── Topbar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface-base)]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green-600 flex items-center justify-center shadow-glow-green">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--content-primary)] text-lg tracking-tight">Playdates</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--surface-inset)] hover:bg-[var(--border-subtle)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <SunIcon className="w-4 h-4 text-[var(--content-muted)]" />
                : <MoonIcon className="w-4 h-4 text-[var(--content-muted)]" />
              }
            </button>
            <Link href="/login" className="btn-ghost text-body py-2 px-4">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-body py-2 px-5">
              Join Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full
                         bg-brand-green-600/10 border border-brand-green-600/20"
            >
              <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse-soft" />
              <span className="text-caption text-brand-green-600 dark:text-brand-green-400 font-medium">
                Tennis matchmaking platform
              </span>
            </motion.div>

            <h1 className="text-display text-[var(--content-primary)] leading-tight mb-5">
              Find your perfect<br />
              <span className="text-[var(--accent-green)]">tennis partner</span>
            </h1>

            <p className="text-body-lg text-[var(--content-secondary)] max-w-md mb-8 leading-relaxed">
              Connect with players at your skill level, book courts, schedule matches, and track your progress — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 mb-12">
              <Link href="/signup" className="btn-primary text-body-lg px-7 py-3.5">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="btn-secondary text-body-lg px-7 py-3.5">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-h3 text-[var(--content-primary)] font-bold">{value}</p>
                  <p className="text-caption text-[var(--content-muted)]">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero visual — court card stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.1 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Feature preview cards */}
            {[
              { label: "Match Found!", sub: "Intermediate player nearby", dot: "green" },
              { label: "Court Booked",  sub: "Riverside Tennis Club · 2pm", dot: "gold"  },
              { label: "New Playmate",  sub: "Alex joined your network",   dot: "green" },
            ].map(({ label, sub, dot }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="card flex items-center gap-4 p-4"
                style={{ marginLeft: i % 2 === 0 ? 0 : 40 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                 ${dot === "green" ? "bg-brand-green-600/15" : "bg-brand-gold-500/15"}`}>
                  {dot === "green"
                    ? <Trophy className="w-5 h-5 text-brand-green-500" />
                    : <MapPin  className="w-5 h-5 text-brand-gold-500" />
                  }
                </div>
                <div>
                  <p className="text-body font-semibold text-[var(--content-primary)]">{label}</p>
                  <p className="text-caption text-[var(--content-muted)]">{sub}</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full shrink-0
                                 ${dot === "green" ? "bg-brand-green-500" : "bg-brand-gold-500"}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section className="bg-[var(--surface-raised)] py-20 border-y border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-overline text-[var(--accent-gold)] mb-3">Everything you need</p>
            <h2 className="text-h2 text-[var(--content-primary)] mb-3">Why choose Playdates?</h2>
            <p className="text-body text-[var(--content-muted)] max-w-md mx-auto">
              A complete platform for tennis players of all skill levels.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={item}
                className="card-hover p-5 flex items-start gap-4 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green-600/10 group-hover:bg-brand-green-600/20
                                flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-[var(--accent-green)]" />
                </div>
                <div>
                  <p className="text-body font-semibold text-[var(--content-primary)] mb-1">{label}</p>
                  <p className="text-body-sm text-[var(--content-muted)]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full
                           bg-brand-gold-500/10 border border-brand-gold-500/20">
            <Star className="w-3.5 h-3.5 text-brand-gold-500" />
            <span className="text-caption text-brand-gold-600 dark:text-brand-gold-400 font-medium">
              Free to join
            </span>
          </div>
          <h2 className="text-h1 text-[var(--content-primary)] mb-4 leading-tight">
            Ready to play?
          </h2>
          <p className="text-body-lg text-[var(--content-secondary)] mb-8 max-w-sm mx-auto">
            Create your profile, find players near you, and book your first match today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-body-lg px-8 py-3.5">
              Create Free Account <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-ghost text-body-lg px-6 py-3.5">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-green-600 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-body font-semibold text-[var(--content-primary)]">Playdates</span>
          </div>
          <p className="text-caption text-[var(--content-muted)]">
            © {new Date().getFullYear()} Playdates. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
