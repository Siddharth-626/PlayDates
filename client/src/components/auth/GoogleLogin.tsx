import { auth, googleProvider } from "@/services/config";
import { signInWithRedirect } from "firebase/auth";
import toast from "react-hot-toast";


export const GoogleLogin = () => {
    const handleGoogleLogin = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            toast.error('Error signing in with Google');
        }
    }
    return (
        <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-green-500 rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow hover:shadow-md transition"
        >
            <img src="/images/google/google.webp" alt="Google" className="w-5 h-5" />
            Sign in with Google
        </button>
    );
}
