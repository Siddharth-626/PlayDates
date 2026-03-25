import { useAuth } from "@/context/authContext";
import { FetchPlayerProfiles } from "@/utils/PlayerProfile/FetchPlayerProfiles";
import { useEffect, useState } from "react";
import ProfileSetupForm from "../SetupProfile/ProfileSetupForm";
import { motion } from "framer-motion";
import { useProfile } from "@/context/profileContext";
import { PlayerProfile } from "@/utils/TYPE";
import {
  User, MapPin, Star, Edit2, Plus, Check,
  Users, BadgeCheck, SlidersHorizontal, Trophy,
} from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import { SkillBasedTennisBallsUi } from "@/components/ui/SkillTennisBalls";

const SKILL_LABELS: Record<string, string> = {
  "1.0 - 1.5": "Beginner",
  "2.0 - 2.5": "Novice",
  "3.0 - 3.5": "Intermediate",
  "4.0 - 4.5": "Advanced",
  "5.0": "Expert",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PlayerProfileDropdown() {
  const { selectedProfile, setSelectedProfile, refreshProfile } = useProfile();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    FetchPlayerProfiles(user.uid).then((data) => {
      setProfiles(data);
      setSelectedProfileId(selectedProfile?.id || data[0]?.id);
    });
    // eslint-disable-next-line
  }, [user?.uid]);

  useEffect(() => {
    const current = profiles.find((p) => p.id === selectedProfileId);
    setSelectedProfile(current || profiles[0]);
    // eslint-disable-next-line
  }, [selectedProfileId, profiles]);

  const handleSelect = (id: string) => setSelectedProfileId(id);

  const handleProfileSaved = async (newId: string) => {
    const data = await FetchPlayerProfiles(user?.uid);
    if (!data) return;
    setProfiles(data);
    setSelectedProfileId(newId);
    await refreshProfile(newId);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  if (!selectedProfile || !profiles) return <Loading />;

  // ── Edit / New-profile form ───────────────────────────────────────────────
  if (isEditing || isAddingNew) {
    return (
      <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--surface-base)" }}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => { setIsEditing(false); setIsAddingNew(false); }}
            className="flex items-center gap-2 text-[13px] text-[var(--content-secondary)] hover:text-[var(--content-primary)] transition-colors mb-6 border border-[var(--border-subtle)] hover:border-[var(--accent-green)]/50 px-4 py-2.5 rounded-xl"
          >
            ← Back to Profile
          </button>
          <ProfileSetupForm
            profile={isEditing ? selectedProfile : undefined}
            update={isEditing}
            onClose={() => { setIsEditing(false); setIsAddingNew(false); }}
            onSuccess={handleProfileSaved}
          />
        </div>
      </div>
    );
  }

  const skillLabel = selectedProfile.skill ? SKILL_LABELS[selectedProfile.skill] || selectedProfile.skill : null;
  const preferencesList: string[] = selectedProfile.preferences || [];
  const locationsList: any[] = selectedProfile.locations || [];

  // ── Full-page profile view ────────────────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ background: "var(--surface-base)" }}
    >
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)", minHeight: 200 }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 right-1/4 w-32 h-32 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-black/10 pointer-events-none" />

        {/* Action buttons top-right */}
        <div className="absolute top-5 right-5 flex gap-2 z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-[13px] font-semibold hover:bg-white/25 transition-all border border-white/20"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
          </button>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-[13px] font-semibold hover:bg-white/25 transition-all border border-white/20"
          >
            <Plus className="w-3.5 h-3.5" /> New Profile
          </button>
        </div>

        {/* Profile info inside banner */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-16 md:px-10 flex items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white/20 bg-white/10 flex items-center justify-center shadow-2xl">
              {selectedProfile.photoUrl ? (
                <img src={selectedProfile.photoUrl} alt={selectedProfile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white/70" />
              )}
            </div>
            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[#166534]" />
          </div>

          {/* Name + meta */}
          <div className="pb-1">
            <h1 className="font-outfit text-[28px] md:text-[34px] font-bold text-white leading-tight drop-shadow-sm">
              {selectedProfile.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {(selectedProfile.age || selectedProfile.gender) && (
                <span className="text-[14px] text-white/70">
                  {[selectedProfile.age, selectedProfile.gender].filter(Boolean).join(" · ")}
                </span>
              )}
              {skillLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[12px] font-semibold border border-white/20">
                  <Star className="w-3.5 h-3.5 text-yellow-300" /> {skillLabel}
                </span>
              )}
              {selectedProfile.skill && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[12px] font-semibold border border-white/20">
                  🎾 NTRP {selectedProfile.skill}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Skill balls row — overlapping banner ────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 mb-2 relative z-10">
        {selectedProfile.skill && (
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-card">
            <SkillBasedTennisBallsUi skill={selectedProfile.skill} />
            <span className="text-[12px] text-[var(--content-muted)]">Skill rating</span>
          </div>
        )}
      </div>

      {/* ── Main content grid ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left / main column (2/3 width) ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Skill Level card */}
            <motion.div variants={itemVariants} className="card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-[14px] font-bold text-[var(--content-primary)]">Skill Level</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[28px] font-outfit font-bold text-[var(--content-primary)] leading-none">
                    {selectedProfile.skill || "—"}
                  </p>
                  <p className="text-[13px] text-[var(--content-muted)] mt-1">
                    {skillLabel || "Not set"} · Self-assessed
                  </p>
                </div>
                <Trophy className="w-12 h-12 text-[var(--accent-gold)]/20" />
              </div>
            </motion.div>

            {/* Preferred Courts card */}
            <motion.div variants={itemVariants} className="card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--accent-green)]" />
                </div>
                <h2 className="text-[14px] font-bold text-[var(--content-primary)]">Preferred Courts</h2>
              </div>
              {locationsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {locationsList.map((loc: any) => (
                    <div
                      key={loc.courtId || loc.name}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface-inset)] border border-[var(--border-subtle)]"
                    >
                      <MapPin className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                      <span className="text-[13px] font-medium text-[var(--content-primary)] truncate">{loc.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="w-8 h-8 text-[var(--border-default)] mb-2" />
                  <p className="text-[13px] text-[var(--content-muted)]">No preferred courts yet</p>
                  <p className="text-[12px] text-[var(--content-muted)] mt-0.5">Browse Find Courts to add some</p>
                </div>
              )}
            </motion.div>

            {/* Play Preferences card */}
            <motion.div variants={itemVariants} className="card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[var(--accent-gold)]" />
                </div>
                <h2 className="text-[14px] font-bold text-[var(--content-primary)]">Play Preferences</h2>
              </div>
              {preferencesList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferencesList.map((pref: string) => (
                    <span
                      key={pref}
                      className="px-3 py-1.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-[13px] font-semibold border border-[var(--accent-gold)]/20"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="w-8 h-8 text-[var(--border-default)] mb-2" />
                  <p className="text-[13px] text-[var(--content-muted)]">No preferences set</p>
                  <p className="text-[12px] text-[var(--content-muted)] mt-0.5">Edit your profile to add preferences</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right / sidebar column (1/3 width) ──────────────────────── */}
          <div className="space-y-5">

            {/* Your Profiles card */}
            <motion.div variants={itemVariants} className="card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-[14px] font-bold text-[var(--content-primary)]">Your Profiles</h2>
                </div>
                {/* Inline + New button (item 12) */}
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[var(--accent-green)] hover:opacity-80 transition-opacity"
                  aria-label="Add new profile"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
              </div>

              <div className="space-y-2">
                {profiles.map((profile) => {
                  const isActive = profile.id === selectedProfileId;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => handleSelect(profile.id)}
                      className={`group w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isActive
                          ? "border-[var(--accent-green)]/50 bg-[var(--accent-green)]/5"
                          : "border-[var(--border-subtle)] hover:border-[var(--accent-green)]/30 bg-[var(--surface-inset)]"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--border-subtle)] bg-[var(--surface-inset)] flex items-center justify-center shrink-0">
                        {profile.photoUrl ? (
                          <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-[var(--content-muted)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--content-primary)] truncate">{profile.name}</p>
                        <p className="text-[11px] text-[var(--content-muted)] truncate">NTRP {profile.skill || "—"}</p>
                      </div>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-green)] shrink-0">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--content-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          Switch
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick stats summary */}
            <motion.div variants={itemVariants} className="card rounded-2xl p-5">
              <h2 className="text-[13px] font-bold text-[var(--content-muted)] uppercase tracking-wide mb-3">Profile Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--content-secondary)]">Preferred Courts</span>
                  <span className="text-[14px] font-bold text-[var(--accent-green)]">{locationsList.length}</span>
                </div>
                <div className="h-px bg-[var(--border-subtle)]" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--content-secondary)]">Preferences</span>
                  <span className="text-[14px] font-bold text-[var(--accent-gold)]">{preferencesList.length}</span>
                </div>
                <div className="h-px bg-[var(--border-subtle)]" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--content-secondary)]">Total Profiles</span>
                  <span className="text-[14px] font-bold text-purple-400">{profiles.length}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
