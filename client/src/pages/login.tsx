import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/config";
import { useRouter } from "next/router";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import { GoogleLogin } from "@/components/auth/GoogleLogin";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

const AUTH_ERROR_MAP: Record<string, string> = {
  "auth/invalid-credential":      "Invalid email or password.",
  "auth/wrong-password":          "Incorrect password.",
  "auth/too-many-requests":       "Too many attempts. Try again later.",
  "auth/network-request-failed":  "Network error. Check your connection.",
  "auth/user-not-found":          "No account found with that email.",
};

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Enter both email and password."); return; }
    if (!validateEmail(email)) { setError("Enter a valid email address."); return; }
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const exists = await checkIfProfileExist(cred.user.uid);
      router.push(exists ? "/" : "/setup");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg  = AUTH_ERROR_MAP[code] || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email)              { toast.error("Enter your email first."); return; }
    if (!validateEmail(email)) { toast.error("Enter a valid email."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent!");
    } catch {
      toast.error("Could not send reset email.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex bg-[var(--surface-base)]">
      {/* ── Left panel — branding ────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-green-900 p-12 relative overflow-hidden">
        {/* Abstract court lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
          <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-white rounded-full" />
          <div className="absolute -top-20 -right-20 w-80 h-80 border border-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white rounded-full" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold-500 flex items-center justify-center shadow-glow-gold">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Playdates</span>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-700/60 border border-brand-green-600/40 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse-soft" />
            <span className="text-caption text-brand-green-200 font-medium">Tennis matchmaking</span>
          </div>
          <h1 className="text-h1 text-white mb-4 leading-tight">
            Find your perfect<br />
            <span className="text-brand-gold-400">tennis partner</span>
          </h1>
          <p className="text-body-lg text-brand-green-200 max-w-sm">
            Connect with players at your skill level, book courts, and never miss a match.
          </p>
        </div>

        {/* Social proof */}
        <div className="relative flex items-center gap-4">
          <div className="flex -space-x-2">
            {["/images/players/defaultProfilePhoto.jpg"].map((src, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-green-700 bg-brand-green-800 overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-caption text-brand-green-300">Trusted by tennis players everywhere</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Theme toggle + signup link */}
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
            <Link
              href="/signup"
              className="text-body text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm animate-fade-in">
            <h2 className="text-h2 text-[var(--content-primary)] mb-1">Welcome back</h2>
            <p className="text-body text-[var(--content-muted)] mb-8">
              Sign in to your Playdates account
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-body">
                <span className="shrink-0 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="input-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="input-label mb-0">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-caption text-[var(--accent-green)] hover:text-brand-green-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-base pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)] hover:text-[var(--content-secondary)] transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-caption text-[var(--content-muted)]">or continue with</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <GoogleLogin />

            <p className="mt-6 text-center text-body text-[var(--content-muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[var(--accent-green)] font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
