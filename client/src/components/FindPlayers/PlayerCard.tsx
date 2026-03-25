import { PlayerProfile } from "@/utils/TYPE";
import { SkillBasedTennisBallsUi } from "../ui/SkillTennisBalls";
import { User, UserPlus, MapPin } from "lucide-react";

export default function PlayerCard({ player, onAddPlaymate, hideAction }: {
  player: PlayerProfile;
  onChallenge?: (p: PlayerProfile) => void;
  onAddPlaymate?: (p: PlayerProfile) => void;
  hideAction?: boolean;
}) {
  const { name, photoUrl, skill, age, gender, locations } = player;
  const primaryLocation = locations?.[0]?.name;

  return (
    <div className="card flex flex-col hover:shadow-raised hover:border-[var(--border-default)] transition-all cursor-pointer overflow-hidden group">
      {/* Card body */}
      <div className="p-4 flex items-start gap-3.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--border-subtle)] bg-[var(--surface-inset)] flex items-center justify-center group-hover:border-[var(--accent-green)] transition-colors">
            {photoUrl ? (
              <img src={photoUrl} alt={`${name}'s profile`} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-[var(--content-muted)]" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[15px] font-semibold text-[var(--content-primary)] truncate leading-tight">{name}</p>
          {age && gender && (
            <p className="text-[12px] text-[var(--content-muted)] mt-0.5">{age} · {gender}</p>
          )}
          {skill && (
            <div className="mt-2">
              <SkillBasedTennisBallsUi skill={skill} />
            </div>
          )}
          {primaryLocation && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 text-[var(--content-muted)] shrink-0" />
              <p className="text-[11px] text-[var(--content-muted)] truncate">{primaryLocation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Card footer — hidden when hideAction is true */}
      {!hideAction && (
        <div className="border-t border-[var(--border-subtle)] px-4 py-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); onAddPlaymate?.(player); }}
            className="w-full flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg
                       bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[12px] font-semibold
                       hover:bg-[var(--accent-green)]/20 transition-colors border border-[var(--accent-green)]/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Playmate
          </button>
        </div>
      )}
    </div>
  );
}
