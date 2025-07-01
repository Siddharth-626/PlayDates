import { useAuth } from "@/context/authContext";
import {
  FetchPlayerProfiles,
  PlayerProfile,
} from "@/utils/FetchPlayerProfiles";
import { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiPlus } from "react-icons/fi";
import ProfileSetupForm from "../SetupProfile/ProfileSetupForm";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerProfileDropdown() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);

  const loadProfiles = async (selectNewId?: string) => {
    if (!user?.uid) return;
    try {
      const data = await FetchPlayerProfiles(user.uid);
      setProfiles(data);
      const defaultId = selectNewId || (data.length > 0 ? data[0].id : "");
      setSelectedProfileId(defaultId);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [user?.uid]);

  useEffect(() => {
    const current = profiles.find((p) => p.id === selectedProfileId);
    setSelectedProfile(current || null);
  }, [selectedProfileId, profiles]);

  const handleSelect = (id: string) => {
    setSelectedProfileId(id);
    setDropdownOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsAddingNew(false);
    setDropdownOpen(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    setDropdownOpen(false);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setIsAddingNew(false);
  };

  const handleProfileSaved = async (newId: string) => {
    await loadProfiles(newId);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  const ProfileDetails = selectedProfile
    ? [
      { label: "Name", value: selectedProfile.name },
      { label: "Skill Level", value: selectedProfile.skill },
      { label: "Gender", value: selectedProfile.gender },
      { label: "Age Category", value: selectedProfile.age },
      {
        label: "Preferences",
        value: selectedProfile.preferences?.join(", ") || "None",
      },
      {
        label: "Preferred Locations",
        value: selectedProfile.locations?.join(", ") || "None",
      },
    ]
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Profile Dropdown Box */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-3xl rounded-xl shadow-xl border border-green-300 p-4"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedProfile && (
            <div className="flex items-center gap-3">
              <img
                src={selectedProfile.photoUrl}
                alt={selectedProfile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {selectedProfile.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Intermediate {selectedProfile.skill}
                </p>
              </div>
            </div>
          )}
          <FiChevronDown className="w-7 h-7 text-gray-500" />
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="absolute left-0 top-full mt-2 w-full bg-white/100 dark:bg-gray-800/100 backdrop-blur-md shadow-lg rounded-xl border border-white/10 z-10 max-h-60 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelect(profile.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 ${profile.id === selectedProfileId
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                    }`}
                >
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {profile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Intermediate {profile.skill}
                    </p>
                  </div>
                </div>
              ))}
              <div
                onClick={handleAddNew}
                className="flex items-center gap-2 p-3 text-sm text-green-700 font-semibold cursor-pointer hover:bg-green-100 dark:hover:bg-green-800"
              >
                <FiPlus /> Add New Player
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedProfile && (
          <button
            onClick={handleEdit}
            className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <FiEdit /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Form */}
      <AnimatePresence>
        {isEditing && selectedProfile && (
          <motion.div
            key="editForm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileSetupForm
              profile={selectedProfile}
              update={true}
              onClose={handleCloseForm}
              onSuccess={handleProfileSaved}
            />
          </motion.div>
        )}
        {isAddingNew && (
          <motion.div
            key="addForm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileSetupForm
              update={false}
              onClose={handleCloseForm}
              onSuccess={handleProfileSaved}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Details View */}
      {selectedProfile && !isEditing && !isAddingNew && (
        <motion.div
          key="details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
            Player Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ProfileDetails.map((item) => (
              <div key={item.label}>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-base font-medium text-gray-800 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
