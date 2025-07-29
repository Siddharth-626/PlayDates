'use client';

import { useAuth } from "@/context/authContext";
import { auth } from "@/services/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";

export const ProfileInfo = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("User logged out successfully");
            router.push('/login');
        } catch (error) {
            console.error("Error while logging out", error);
            toast.error('Error while logging out');
        }
    };

    if (!user) return null;

    return (
        <div className="relative inline-block">
            <button
                className="rounded-full border-2 border-green-400 hover:border-green-500 transition duration-300 p-[2px] bg-gradient-to-br from-white/40 via-white/10 to-white/0 dark:from-gray-600 dark:to-gray-900 shadow-md"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
                <Image
                    src={user.photoURL || "/images/players/defaultProfilePhoto.jpg"}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="rounded-full object-cover w-11 h-11"
                />
            </button>

            {isDropdownVisible && (
                <div className="absolute right-0 z-50 mt-3 w-56 border border-green-200 dark:border-green-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl animate-fade-in-down overflow-hidden">
                    <a
                        href="/profile"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-green-50 dark:hover:bg-green-900 transition-colors text-green-700 dark:text-green-300 font-semibold"
                    >
                        <User size={20} /> My Profile
                    </a>
                    <a
                        href="/settings"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                    >
                        <Settings size={20} /> Settings
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-5 py-3 text-red-500 hover:bg-red-500 hover:text-white font-semibold transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            )}
        </div>
    );
};
