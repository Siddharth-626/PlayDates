import { auth, db, googleProvider } from "@/services/config";
import { signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { checkIfProfileExist } from "@/utils/checkUserProfile";


export const GoogleLogin = () => {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: user.displayName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                photoUrl: user.photoURL || '',
                timestamp: serverTimestamp(),
            }, { merge: true });

            toast.success(`Logged in as ${user.displayName || user.email}`);
            const profileExist = await checkIfProfileExist(user.uid);
            router.push(profileExist ? "/" : "/setup");
        } catch (error: any) {
            if (error?.code !== 'auth/popup-closed-by-user') {
                toast.error('Error signing in with Google');
            }
        }
    };

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
