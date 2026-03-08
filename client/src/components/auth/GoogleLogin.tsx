import { auth, db, googleProvider } from "@/services/config";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import { signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export const GoogleLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                name: user.displayName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                photoUrl: user.photoURL || '',
                timestamp: serverTimestamp()
            }

            await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
            console.log('Google user data saved');
            toast.success(`Logged in as ${userData.name}`)

            const profileExist = await checkIfProfileExist(user.uid);
            await router.push(profileExist ? "/" : "/setup");
        } catch (error) {
            console.error("Error while Google login", error);
            toast.error('Error while logging in with Google')
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-green-500 rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow hover:shadow-md transition ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Sign in with Google"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
            ) : (
                <img src="/images/google/google.webp" alt="Google" className="w-5 h-5" />
            )}
            {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
    );
}