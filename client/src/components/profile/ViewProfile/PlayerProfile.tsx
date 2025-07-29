import { useAuth } from "@/context/authContext";
import { FetchPlayerProfiles } from "@/utils/PlayerProfile/FetchPlayerProfiles";
import { useEffect, useState, useMemo } from "react";
import { FiChevronDown, FiEdit, FiPlus } from "react-icons/fi";
import ProfileSetupForm from "../SetupProfile/ProfileSetupForm";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/profileContext";
import { PlayerProfile } from "@/utils/TYPE";
import { User, MapPin, Settings, LogOut, BadgeCheck, Users, SlidersHorizontal } from "lucide-react";
import { Loading } from "@/components/ui/Loading";

export default function PlayerProfileDropdown() {
  const { selectedProfile, setSelectedProfile, refreshProfile } = useProfile();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch profiles only when user changes
  useEffect(() => {
    if (!user?.uid) return;
    FetchPlayerProfiles(user.uid).then((data) => {
      setProfiles(data);
      setSelectedProfileId(selectedProfile?.id || data[0]?.id);
    });
    // eslint-disable-next-line
  }, [user?.uid]);

  // Set selected profile when profiles or selectedProfileId changes
  useEffect(() => {
    const current = profiles.find((p) => p.id === selectedProfileId);
    setSelectedProfile(current || profiles[0]);
    // eslint-disable-next-line
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
    const data = await FetchPlayerProfiles(user?.uid);
    if(!data)return
    setProfiles(data);
    setSelectedProfileId(newId);
    await refreshProfile(newId);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  // Memoize profile details for efficiency
  const ProfileDetails = useMemo(() => selectedProfile ? [
    { label: "Name", value: selectedProfile.name, icon: <User size={18} className="text-green-500" /> },
    { label: "Skill Level", value: selectedProfile.skill, icon: <BadgeCheck size={18} className="text-blue-500" /> },
    { label: "Gender", value: selectedProfile.gender, icon: <Users size={18} className="text-pink-400" /> },
    { label: "Age Category", value: selectedProfile.age, icon: <SlidersHorizontal size={18} className="text-yellow-500" /> },
    {
      label: "Preferences",
      value: selectedProfile.preferences?.join(", ") || "None",
      icon: <Settings size={18} className="text-purple-500" />
    },
    {
      label: "Preferred Locations",
      value: selectedProfile.locations?.length > 0
        ? selectedProfile.locations.map((loc) => loc.name).join(", ")
        : "None",
      icon: <MapPin size={18} className="text-green-400" />
    },
  ] : [], [selectedProfile]);
  if(!selectedProfile || !profiles) return <Loading />
  return (
    <div className="w-full space-y-6">
      {/* Profile Dropdown Box */}
      <div className="relative bg-white dark:bg-gray-800/20 backdrop-blur-3xl rounded-xl shadow-xl border border-green-300 p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedProfile && (
            <div className="flex items-center gap-3">
              <img
                src={selectedProfile.photoUrl}
                alt={selectedProfile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-400 shadow"
              />
              <div>
                <p className="text-base font-semibold text-green-700 dark:text-green-400">
                  {selectedProfile.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  {selectedProfile.skill}
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
              transition={{ duration: 0.4 }}
            >
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelect(profile.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-green-100 dark:hover:bg-green-800 ${profile.id === selectedProfileId
                    ? "bg-white dark:bg-gray-700"
                    : ""
                    }`}
                >
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover border border-green-300"
                  />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {profile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profile.skill}
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
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
            <User size={22} className="text-green-500" /> Player Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ProfileDetails.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span>{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
