'use client';

import { useAuth } from "@/context/authContext";
import { auth } from "@/services/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";

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
        <div
            className="relative inline-block"
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        >
            <button className="rounded-full border-2 border-green-400 hover:border-green-500 transition duration-300 p-[2px] bg-gradient-to-br from-white/40 via-white/10 to-white/0 dark:from-gray-600 dark:to-gray-900">
                <Image
                    src={user.photoURL || "/images/players/defaultProfilePhoto.jpg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                />
            </button>

            {isDropdownVisible && (
                <div className="absolute right-0 z-50 mt-2 w-48 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg transition-all">
                    <a
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl"
                    >
                        My Profile
                    </a>
                    <a
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Settings
                    </a>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white  rounded-b-xl"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};
