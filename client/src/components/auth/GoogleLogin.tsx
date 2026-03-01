import { auth, db, googleProvider } from "@/services/config";
import { checkIfProfileExist } from "@/utils/checkUserProfile";
import { signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";


export const GoogleLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handelGoogleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                name: user.displayName || '',
                emai: user.email || '',
                phoneNumber: user.phoneNumber || '',
                photoUrl: user.photoURL || '',
                timestamp: serverTimestamp()
            }

            await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
            console.log('Google user data saved');
            toast.success(`Lodgin as ${userData.name}`)

            const profileExist = await checkIfProfileExist(user.uid);
            await router.push(profileExist ? "/" : "/setup");
        } catch (error) {
            console.log("err while google login", error);
            toast.error('err while loging in with google')
            setIsLoading(false);
        }
    }
    return (
        <button
            onClick={handelGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-green-500 rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
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