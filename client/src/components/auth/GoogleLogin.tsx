import { auth, db, googleProvider } from "@/services/config";
import { signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import toast from "react-hot-toast";


export const GoogleLogin = () => {
    const router = useRouter();
    const handelGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log(user);

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
            router.push('/')
        } catch (error) {
            console.log("err while google login", error);
            toast.error('err while loging in with google')
        }
    }
    return (
        <button
            onClick={handelGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-green-500 rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow hover:shadow-md transition"
        >
            <img src="/images/google/google.webp" alt="Google" className="w-5 h-5" />
            Sign in with Google
        </button>
    );
}