import { PlayerProfile } from "@/utils/TYPE";
import { SkillBasedTennisBallsUi } from "../ui/SkillTennisBalls";
import { User } from "lucide-react";

export default function PlayerCard({ player }: { player: PlayerProfile }) {
    const { name, photoUrl, skill, age, gender } = player;

    return (
        <div className="flex items-center gap-3 bg-[#111f2e] border border-[#1e3040] rounded-2xl p-4 hover:border-[#22c55e] transition-all">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#22c55e] shrink-0 bg-[#1a2a3a] flex items-center justify-center">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${name}'s profile`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User className="w-5 h-5 text-[#6b7280]" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[#22c55e] truncate">{name}</div>
                <div className="text-[12px] text-[#6b7280] mt-0.5">
                    {age && gender ? `${age} · ${gender}` : age ?? gender ?? ""}
                </div>
            </div>

            {/* Skill */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <SkillBasedTennisBallsUi skill={skill} />
                <span className="text-[11px] font-semibold text-[#22c55e]">{skill}</span>
            </div>
        </div>
    );
}
