
import Navbar from "@/components/Navbar";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";


export default function SetupProfile() {
    return(
           <> <Navbar />
         <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
           <ProfileSetupForm />
        </div>
        </>
    )
}