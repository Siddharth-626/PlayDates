import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Trophy, Phone } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/services/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import { GoogleLogin } from "@/components/auth/GoogleLogin";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

export default function Signup() {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber,     setPhoneNumber]     = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  const handleSignup = async () => {
    setError("");
    if (!name.trim())                       { setError("Name is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    if (password.length < 6)               { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword)      { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name, email, phoneNumber, createdAt: new Date().toISOString(),
      });
      toast.success("Account created!");
      const exists = await checkIfProfileExist(cred.user.uid);
      router.push(exists ? "/" : "/setup");
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use"
        ? "Email already in use. Try logging in."
        : err.code === "auth/invalid-email"
        ? "Invalid email address."
        : err.message || "Signup failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="min-h-screen flex bg-[var(--surface-base)]">
      {/* ── Left branding panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-brand-green-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
          <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-white rounded-full" />
          <div className="absolute -top-20 -right-20 w-80 h-80 border border-white rounded-full" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Playdates</span>
        </div>
        <div className="relative">
          <h1 className="text-h1 text-white mb-4 leading-tight">
            Join the<br />
            <span className="text-brand-gold-400">tennis community</span>
          </h1>
          <p className="text-body-lg text-brand-green-200">
            Set up your player profile in minutes and start finding matches today.
          </p>
        </div>
        <div className="relative">
          <p className="text-caption text-brand-green-400">Already on Playdates?</p>
          <Link href="/login" className="text-body font-semibold text-brand-green-200 hover:text-white transition-colors">
            Sign in instead →
          </Link>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-green-600 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--content-primary)] text-base">Playdates</span>
          </div>
          <div className="hidden lg:block" />
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
            <Link href="/login" className="text-body text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-6">
          <div className="w-full max-w-sm animate-fade-in">
            <h2 className="text-h2 text-[var(--content-primary)] mb-1">Create account</h2>
            <p className="text-body text-[var(--content-muted)] mb-6">
              Start your Playdates journey
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-body">
                <span className="shrink-0 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            <div className="space-y-3.5" onKeyDown={handleKeyDown}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="input-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="name" type="text" placeholder="Your name"
                    autoComplete="name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="input-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="email" type="email" placeholder="you@example.com"
                    autoComplete="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="input-label">Phone <span className="text-[var(--content-muted)] normal-case font-normal">(optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="phone" type="tel" placeholder="+1 555 000 0000"
                    autoComplete="tel" value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="password" type={showPass ? "text" : "password"}
                    placeholder="At least 6 characters"
                    autoComplete="new-password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base pl-10 pr-10"
                  />
                  <button
                    type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)] hover:text-[var(--content-secondary)] transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="confirmPassword" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    autoComplete="new-password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`input-base pl-10 pr-10 ${confirmPassword && confirmPassword !== password ? "input-error" : ""}`}
                  />
                  <button
                    type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)] hover:text-[var(--content-secondary)] transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="mt-1.5 text-caption text-red-500">Passwords do not match</p>
                )}
              </div>

              <button
                type="button" onClick={handleSignup} disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-caption text-[var(--content-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <GoogleLogin />

            <p className="mt-5 text-center text-body text-[var(--content-muted)]">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--accent-green)] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
