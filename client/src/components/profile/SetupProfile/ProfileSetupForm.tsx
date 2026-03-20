import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/services/config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import ProfileImageUploader from "./ProfileImageUploader";
import NameField from "./NameField";
import GenderDropdown from "./GenderDropdown";
import AgeCategoryDropdown from "./AgeCategoryDropdown";
import SkillLevelDropdown from "./SkillLevelDropdown";
import PreferencesSelector from "../../commonComponents/Profile/PreferencesSelector";
import LocationSelector from "../../commonComponents/Profile/LocationSelector";
import { v4 as uuidv4 } from "uuid";
import { PlayerProfile } from "@/utils/TYPE";
import toast from "react-hot-toast";
import { X, UserPlus, Pencil } from "lucide-react";
import { uploadImage } from "@/utils/Image/uploadImage";
import { motion } from "framer-motion";

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
    playmates: [],
    image: null as File | null,
  });
  const router = useRouter();

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

      let photoUrl = "/images/players/defaultProfilePhoto.jpg";
      if (profileData.image) {
        photoUrl = await uploadImage(uid, profileData.image, profileId);
      }

      await setDoc(profileRef, {
        userUid: auth.currentUser?.uid,
        name: profileData.name,
        gender: profileData.gender,
        age: profileData.age,
        skill: profileData.skill,
        preferences: profileData.preferences,
        locations: profileData.locations,
        photoUrl: photoUrl,
        playmates: [],
        completed: true,
      });

      toast.success("Profile added successfully!");
      onSuccess(profileId);
      router.push('/');
    } catch (error) {
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

      let photoUrl = profile.photoUrl || "/images/players/defaultProfilePhoto.jpg";
      if (profileData.image) {
        photoUrl = await uploadImage(uid, profileData.image, profile.id);
      }
      await updateDoc(profileRef, {
        name: profileData.name,
        gender: profileData.gender,
        age: profileData.age,
        skill: profileData.skill,
        preferences: profileData.preferences,
        locations: profileData.locations,
        photoUrl: photoUrl,
        completed: true,
      });

      toast.success("Profile updated successfully!");
      onSuccess(profile.id);
    } catch (error) {
      toast.error("Something went wrong while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full max-w-3xl relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 space-y-8"
      aria-label={update ? "Edit Profile Form" : "Player Profile Form"}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold transition"
        disabled={isLoading}
        aria-label="Close profile setup"
      >
        <X className="w-5 h-5" />
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="text-2xl md:text-3xl font-extrabold text-center text-green-700 dark:text-green-400 uppercase tracking-wide flex items-center justify-center gap-2"
      >
        {update ? (
          <>
            <Pencil className="w-6 h-6 text-green-500" />
            Edit Profile
          </>
        ) : (
          <>
            <UserPlus className="w-6 h-6 text-green-500" />
            Player Profile
          </>
        )}
      </motion.h2>

      <ProfileImageUploader
        value={profileData.image}
        onChange={(img) => updateField("image", img)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        className="space-y-6"
      >
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
        type="Profile"
          selected={profileData.preferences}
          onChange={(val) => updateField("preferences", val)}
        />
        <LocationSelector
        type="Profile"
          selected={profileData.locations}
          onChange={(val) => updateField("locations", val)}
        />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={update ? handleUpdate : handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 text-white text-lg font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-4 ${
          isLoading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:focus:ring-green-500"
        } flex items-center justify-center gap-2`}
        aria-label={update ? "Update Profile" : "Save Profile"}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Saving...
          </>
        ) : update ? (
          <>
            <Pencil className="w-5 h-5" />
            Update
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Save
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
