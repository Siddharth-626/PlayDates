import { CheckCircle2, X, Users } from "lucide-react";
import toast from "react-hot-toast";

const options = [
  { value: "Singles", icon: "🎾", description: "1v1 match" },
  { value: "Co-ed Singles", icon: "🤝", description: "Mixed gender" },
  { value: "Mixed Doubles", icon: "👫", description: "Mixed pairs" },
  { value: "Doubles", icon: "👥", description: "2v2 match" },
];

export default function PreferencesSelector({
  selected,
  onChange,
  type,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
  type: string;
}) {
  const toggle = (pref: string) => {
    const alreadySelected = selected.includes(pref);
    if (alreadySelected) {
      onChange(selected.filter((p) => p !== pref));
    } else {
      if (type === "Match-Creation" && selected.length === 1) {
        toast.error("Only one match type can be selected");
        return;
      }
      onChange([...selected, pref]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[var(--accent-green)]" />
        <span className="text-[13px] font-semibold text-[var(--content-primary)]">
          {type === "Match-Creation" ? "Match Type" : "Play Preferences"}
        </span>
        {selected.length > 0 && (
          <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
            {selected.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              type="button"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]"
                  : "bg-[var(--surface-inset)] border-[var(--border-subtle)] text-[var(--content-secondary)] hover:border-[var(--accent-green)]/50 hover:text-[var(--content-primary)]"
              }`}
            >
              <span className="text-[18px] shrink-0">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{opt.value}</p>
                <p className="text-[11px] opacity-60 truncate">{opt.description}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((pref) => (
            <span
              key={pref}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[11px] font-semibold border border-[var(--accent-green)]/20"
            >
              {pref}
              <button
                type="button"
                onClick={() => onChange(selected.filter((s) => s !== pref))}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
