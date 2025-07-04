import { SkillBasedTennisBallsUi } from "@/components/ui/SkillTennisBalls";
import { PlayerProfile } from "@/utils/PlayerProfile/FetchPlayerProfiles";
import { GiTennisBall } from "react-icons/gi";

export default function ProfileHeader({ profile }: { profile: PlayerProfile }) {
    return (
        <div className="text-center">
            <div className="relative w-40 h-40 mx-auto">
                <img
                    src={profile.photoUrl}
                    className="rounded-full border-4 border-green-500 shadow-lg w-full h-full object-cover"
                    alt={profile.name}
                />
            </div>
            <h2 className="text-2xl font-bold mt-4 text-green-700 dark:text-green-400">{profile.name}</h2>
            <div className="flex justify-center mt-1 mb-1">
                <SkillBasedTennisBallsUi skill={profile.skill}/>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Skill Level: {profile.skill}</p>
        </div>
    );
}
