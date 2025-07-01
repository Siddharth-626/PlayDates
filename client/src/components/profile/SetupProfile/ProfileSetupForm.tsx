import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/services/config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import ProfileImageUploader from "./ProfileImageUploader";
import NameField from "./NameField";
import GenderDropdown from "./GenderDropdown";
import AgeCategoryDropdown from "./AgeCategoryDropdown";
import SkillLevelDropdown from "./SkillLevelDropdown";
import PreferencesSelector from "./PreferencesSelector";
import LocationSelector from "./LocationSelector";
import { v4 as uuidv4 } from "uuid";
import { PlayerProfile } from "@/utils/FetchPlayerProfiles";
import toast from "react-hot-toast";
import { X } from "lucide-react";

type ProfileProps = {
  profile?: PlayerProfile;
  update: boolean;
  onClose: () => void;
  onSuccess: (newProfileId: string) => void;
};

export default function ProfileSetupForm({
  profile,
  update,
  onClose,
  onSuccess,
}: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile?.name || "",
    gender: profile?.gender || "",
    age: profile?.age || "18–35",
    skill: profile?.skill || "3.5",
    preferences: profile?.preferences || [],
    locations: profile?.locations || [],
    playmates:[],
    image: null as File | null,
  });

  const updateField = (field: string, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const profileId = uuidv4();
      const profileRef = doc(db, "users", uid, "profile", profileId);

      await setDoc(profileRef, {
        userUid:auth.currentUser?.uid,
        name: profileData.name,
        gender: profileData.gender,
        age: profileData.age,
        skill: profileData.skill,
        preferences: profileData.preferences,
        locations: profileData.locations,
        photoUrl: "/images/players/donald.jpeg",
        playmates:[],
        completed: true,
      });

      toast.success("Profile added successfully!");
      onSuccess(profileId);
    } catch (error) {
      console.error("Error while creating profile:", error);
      toast.error("Something went wrong while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !profile?.id) return;

    try {
      setIsLoading(true);
      const profileRef = doc(db, "users", uid, "profile", profile.id);

      await updateDoc(profileRef, {
        name: profileData.name,
        gender: profileData.gender,
        age: profileData.age,
        skill: profileData.skill,
        preferences: profileData.preferences,
        locations: profileData.locations,
        photoUrl: "/images/players/donald.jpeg",
        completed: true,
      });

      toast.success("Profile updated successfully!");
      onSuccess(profile.id);
    } catch (error) {
      console.error("Error while updating profile:", error);
      toast.error("Something went wrong while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-green-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 space-y-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
          disabled={isLoading}
        >
          <X className="w-5 h-5 hover:text-red-500" />
        </button>

        <h2 className="text-3xl font-extrabold text-center text-green-700 dark:text-green-400 uppercase tracking-wide">
          {update ? "Edit Profile" : "Player Profile"}
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
          onClick={update ? handleUpdate : handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 text-white text-lg font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-4 ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:focus:ring-green-500"
          }`}
        >
          {isLoading ? "Saving..." : update ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
