'use client';

import { useAuth } from "@/context/authContext";
import { auth } from "@/services/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export const ProfileInfo = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handle = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push("/login");
        } catch {
            toast.error("Error while logging out");
        }
    };

    if (!user) return null;

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--surface-inset)] transition-colors"
                aria-label="Profile menu"
                aria-expanded={open}
            >
                <Image
                    src={user.photoURL || "/images/players/defaultProfilePhoto.jpg"}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-9 h-9 ring-2 ring-[var(--accent-green)] ring-offset-1 ring-offset-[var(--surface-raised)]"
                />
                <ChevronDown
                    className={`w-3.5 h-3.5 text-[var(--content-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    className="absolute right-0 z-50 mt-2 w-56 animate-scale-in
                               bg-[var(--surface-overlay)] border border-[var(--border-subtle)]
                               rounded-xl shadow-dropdown overflow-hidden"
                >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                        <p className="text-body font-semibold text-[var(--content-primary)] truncate">
                            {user.displayName || "Player"}
                        </p>
                        <p className="text-caption text-[var(--content-muted)] truncate">{user.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="py-1">
                        <button
                            onClick={() => { setOpen(false); router.push("/profile"); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-body
                                       text-[var(--content-secondary)] hover:text-[var(--content-primary)]
                                       hover:bg-[var(--surface-inset)] transition-colors"
                        >
                            <User className="w-4 h-4 text-[var(--accent-green)]" />
                            My Profile
                        </button>
                        <button
                            onClick={() => { setOpen(false); router.push("/settings"); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-body
                                       text-[var(--content-secondary)] hover:text-[var(--content-primary)]
                                       hover:bg-[var(--surface-inset)] transition-colors"
                        >
                            <Settings className="w-4 h-4 text-[var(--content-muted)]" />
                            Settings
                        </button>
                    </div>

                    <div className="border-t border-[var(--border-subtle)] py-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-body
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
};
