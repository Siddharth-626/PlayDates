import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db, storage } from "@/services/config";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProfileImageUploader from "./ProfileImageUploader";
import NameField from "./NameField";
import GenderDropdown from "./GenderDropdown";
import AgeCategoryDropdown from "./AgeCategoryDropdown";
import SkillLevelDropdown from "./SkillLevelDropdown";
import PreferencesSelector from "./PreferencesSelector";
import LocationSelector from "./LocationSelector";

export default function ProfileSetupForm() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    age: "18–35",
    skill: "3.5",
    preferences: [] as string[],
    locations: [] as string[],
    image: null as File | null,
  });

  const updateField = (field: string, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      let photoUrl = "";
      if (profileData.image) {
        const imgRef = ref(storage, `users/${uid}/profile.jpg`);
        await uploadBytes(imgRef, profileData.image);
        photoUrl = await getDownloadURL(imgRef);
      }

      const profileRef = doc(db, "users", uid, "profile", "info");
      await setDoc(profileRef, {
        name: profileData.name,
        gender: profileData.gender,
        age: profileData.age,
        skill: profileData.skill,
        preferences: profileData.preferences,
        locations: profileData.locations,
        photoUrl,
        completed: true,
      });

      router.push("/");
    } catch (error) {
      console.error("Error while creating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-green-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-green-700 dark:text-green-400 uppercase tracking-wide">
          Player Profile
        </h2>

        <ProfileImageUploader
          value={profileData.image}
          onChange={(img) => updateField("image", img)}
        />

        <div className="space-y-6">
          <NameField
            value={profileData.name}
            onChange={(val) => updateField("name", val)}
          />
          <GenderDropdown
            value={profileData.gender}
            onChange={(val) => updateField("gender", val)}
          />
          <AgeCategoryDropdown
            value={profileData.age}
            onChange={(val) => updateField("age", val)}
          />
          <SkillLevelDropdown
            value={profileData.skill}
            onChange={(val) => updateField("skill", val)}
          />
          <PreferencesSelector
            selected={profileData.preferences}
            onChange={(val) => updateField("preferences", val)}
          />
          <LocationSelector
            selected={profileData.locations}
            onChange={(val) => updateField("locations", val)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-500"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
