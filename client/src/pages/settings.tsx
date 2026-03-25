import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useProfile } from "@/context/profileContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Bell, Sun, Shield, ChevronRight,
  Moon, Check, ArrowLeft, Save, Mail, Eye, EyeOff,
} from "lucide-react";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/config";
import toast from "react-hot-toast";
import PreferencesSelector from "@/components/commonComponents/Profile/PreferencesSelector";
import LocationSelector from "@/components/commonComponents/Profile/LocationSelector";

// ─── Section keys ──────────────────────────────────────────────────────────
type SectionKey = "account" | "preferences" | "notifications" | "appearance" | "privacy";

interface NavItem { key: SectionKey; label: string; icon: React.ElementType; description: string; }

const NAV_ITEMS: NavItem[] = [
  { key: "account",       label: "Account",       icon: User,   description: "Name, email, password" },
  { key: "preferences",   label: "Preferences",   icon: Check,  description: "Skills & match preferences" },
  { key: "notifications", label: "Notifications", icon: Bell,   description: "Alerts & reminders" },
  { key: "appearance",    label: "Appearance",    icon: Sun,    description: "Theme & display" },
  { key: "privacy",       label: "Privacy",       icon: Shield, description: "Profile visibility" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { selectedProfile } = useProfile();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  // ── Account state
  const [displayName, setDisplayName] = useState(selectedProfile?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Preferences state
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(selectedProfile?.preferences ?? []);
  const [selectedLocations, setSelectedLocations] = useState(selectedProfile?.locations ?? []);

  // ── Notifications state
  const [notifMatchAlerts, setNotifMatchAlerts] = useState(true);
  const [notifPlaymateRequests, setNotifPlaymateRequests] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  // ── Privacy state
  const [profileVisible, setProfileVisible] = useState("everyone");
  const [allowInvites, setAllowInvites] = useState("playmates");

  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleSaveAccount = async () => {
    if (!user || !selectedProfile) return;
    setSaving(true);
    try {
      // Update display name in Firestore
      if (displayName !== selectedProfile.name) {
        await updateDoc(doc(db, `users/${user.uid}/profile/${selectedProfile.id}`), { name: displayName });
      }
      // Change password (requires re-auth)
      if (newPassword) {
        if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); setSaving(false); return; }
        if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); setSaving(false); return; }
        if (!user.email || !currentPassword) { toast.error("Enter your current password"); setSaving(false); return; }
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPassword);
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        toast.success("Password updated!");
      }
      toast.success("Account saved!");
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user || !selectedProfile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, `users/${user.uid}/profile/${selectedProfile.id}`), {
        preferences: selectedPreferences,
        locations: selectedLocations,
      });
      toast.success("Preferences saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <label className="input-label">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="input-base pl-10"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                <input
                  type="email"
                  value={user.email ?? ""}
                  disabled
                  className="input-base pl-10 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-caption text-[var(--content-subtle)] mt-1">Email cannot be changed.</p>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-body font-semibold text-[var(--content-primary)] mb-4">Change Password</p>

              <div className="space-y-3">
                <div>
                  <label className="input-label">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="input-base pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--content-muted)]"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input-base pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--content-muted)]"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`input-base pl-10 ${confirmPassword && confirmPassword !== newPassword ? "input-error" : ""}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-caption text-red-400 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>
            </div>

            <button onClick={handleSaveAccount} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <PreferencesSelector selected={selectedPreferences} onChange={setSelectedPreferences} type="Profile" />
            <LocationSelector selected={selectedLocations} onChange={setSelectedLocations} type="Profile" />
            <button onClick={handleSavePreferences} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {[
              { label: "Match Alerts", description: "Receive alerts for match invites and updates.", value: notifMatchAlerts, onChange: setNotifMatchAlerts },
              { label: "Playmate Requests", description: "Get notified when someone adds you as a playmate.", value: notifPlaymateRequests, onChange: setNotifPlaymateRequests },
              { label: "Reminders", description: "Daily summaries and upcoming match reminders.", value: notifReminders, onChange: setNotifReminders },
            ].map((item) => (
              <div key={item.label} className="card flex items-center justify-between p-4">
                <div>
                  <p className="text-body font-semibold text-[var(--content-primary)]">{item.label}</p>
                  <p className="text-caption text-[var(--content-muted)] mt-0.5">{item.description}</p>
                </div>
                <button
                  onClick={() => item.onChange(!item.value)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? "bg-[var(--accent-green)]" : "bg-[var(--border-default)]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? "translate-x-6" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-4">
            <p className="text-body-sm text-[var(--content-muted)]">Choose how Playdates looks on your device.</p>
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-full card flex items-center justify-between p-4 transition-all ${
                  theme === t ? "border-[var(--accent-green)] shadow-glow-green" : "hover:border-[var(--accent-green)]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {t === "light" ? <Sun className="w-5 h-5 text-[var(--accent-gold)]" /> : <Moon className="w-5 h-5 text-[var(--accent-green)]" />}
                  <span className="text-body font-medium text-[var(--content-primary)] capitalize">{t}</span>
                </div>
                {theme === t && <Check className="w-4 h-4 text-[var(--accent-green)]" />}
              </button>
            ))}
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <label className="input-label">Who can see your profile?</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { value: "everyone", label: "Everyone" },
                  { value: "playmates", label: "Playmates" },
                  { value: "nobody", label: "Private" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setProfileVisible(opt.value)}
                    className={`py-2.5 px-3 rounded-xl text-body-sm font-medium border transition-all ${
                      profileVisible === opt.value
                        ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]"
                        : "bg-[var(--surface-inset)] border-[var(--border-subtle)] text-[var(--content-muted)] hover:border-[var(--border-default)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="input-label">Who can send you match invites?</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { value: "everyone", label: "Everyone" },
                  { value: "playmates", label: "Playmates" },
                  { value: "nobody", label: "Nobody" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAllowInvites(opt.value)}
                    className={`py-2.5 px-3 rounded-xl text-body-sm font-medium border transition-all ${
                      allowInvites === opt.value
                        ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]"
                        : "bg-[var(--surface-inset)] border-[var(--border-subtle)] text-[var(--content-muted)] hover:border-[var(--border-default)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => toast.success("Privacy settings saved!")}>
              <Save className="w-4 h-4" /> Save Privacy Settings
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => activeSection ? setActiveSection(null) : router.push("/")}
          className="p-2 rounded-xl bg-[var(--surface-inset)] hover:bg-[var(--border-subtle)] transition shrink-0"
          aria-label={activeSection ? "Back to settings" : "Back to dashboard"}
        >
          <ArrowLeft className="w-4 h-4 text-[var(--content-secondary)]" />
        </button>
        <div>
          <h1 className="text-h2 font-bold text-[var(--content-primary)]">
            {activeSection ? NAV_ITEMS.find(n => n.key === activeSection)?.label : "Settings"}
          </h1>
          {!activeSection && (
            <p className="text-caption text-[var(--content-muted)] mt-0.5">
              Manage your account and preferences
            </p>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div
            key="nav"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.key)}
                  className="w-full card flex items-center gap-4 p-4 hover:border-[var(--accent-green)]/40 hover:shadow-elevation-2 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-inset)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[var(--accent-green)]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-body font-semibold text-[var(--content-primary)]">{item.label}</p>
                    <p className="text-caption text-[var(--content-muted)]">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--content-muted)] shrink-0" />
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
