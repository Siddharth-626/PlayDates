import { PlayerProfile } from "@/utils/TYPE";
import { SkillBasedTennisBallsUi } from "../ui/SkillTennisBalls";

export default function PlayerCard(player: PlayerProfile) {

    const { name, photoUrl, skill, locations } = player;
    const LocationsNames = locations.slice(0,4).map(loc => loc.name);
    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition hover:scale-[1.01]">
            {/* Left: Image */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 shadow">
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={`${name}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600">
                            No Img
                        </div>
                    )}
                </div>

                {/* Middle: Name + Locations */}
                <div>
                    <h2 className="text-green-700 dark:text-green-400 font-semibold text-base">{name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{LocationsNames.join(", ")}</p>
                </div>
            </div>

            {/* Right: Skill + Button */}
            <div className="flex items-center gap-4">
                <div className="flex justify-center mt-1">
                    <SkillBasedTennisBallsUi skill={skill} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{skill}</span>
            </div>
        </div>
    );
}
