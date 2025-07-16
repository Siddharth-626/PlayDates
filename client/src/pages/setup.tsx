
import Navbar from "@/components/Navbar";
import ProfileSetupForm from "@/components/profile/SetupProfile/ProfileSetupForm";


export default function SetupProfile() {
  return (
    <> <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-slate-200 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
        <ProfileSetupForm
          update={false}
          onClose={() => { }}
          onSuccess={() => { }}
        />
      </div>
    </>
  )
}