import { useState } from "react";
import { useCourt } from "@/context/courtContext";
import { SlidersHorizontal, MapPin, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// NTRP-style numeric skill labels (item 17)
const SKILL_LEVELS = [
  { value: "1.0 - 1.5", label: "1.0–1.5" },
  { value: "2.0 - 2.5", label: "2.0–2.5" },
  { value: "3.0 - 3.5", label: "3.0–3.5" },
  { value: "4.0 - 4.5", label: "4.0–4.5" },
  { value: "5.0",       label: "5.0"     },
];

type FilterType = {
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedSkill: string;
  onSkillChange: (value: string) => void;
};

export default function Filters({ selectedLocation, onLocationChange, selectedSkill, onSkillChange }: FilterType) {
  const { courts } = useCourt();
  // item 16: expanded by default
  const [open, setOpen] = useState(true);

  const activeCount = (selectedLocation ? 1 : 0) + (selectedSkill ? 1 : 0);

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer whitespace-nowrap ${
      active
        ? "bg-[var(--accent-green)]/15 border-[var(--accent-green)]/50 text-[var(--accent-green)]"
        : "bg-[var(--surface-inset)] border-[var(--border-subtle)] text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:border-[var(--border-default)]"
    }`;

  const clearAll = () => {
    onLocationChange("");
    onSkillChange("");
  };

  return (
    <div className="w-full">
      {/* Toggle bar — item 16: label "Hide filters" / "Show filters" */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all
          ${open
            ? "bg-[var(--surface-inset)] border-[var(--accent-green)]/40"
            : "bg-[var(--surface-inset)] border-[var(--border-subtle)] hover:border-[var(--border-default)]"
          }`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {/* item 16: chevron at least 20×20 */}
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent-green)]" />
          <span className="text-[13px] font-semibold text-[var(--content-primary)]">
            {open ? "Hide filters" : "Show filters"}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent-green)] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="text-[11px] text-[var(--content-muted)] hover:text-red-400 transition-colors flex items-center gap-0.5"
              aria-label="Clear all filters"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          {/* item 16: chevron min 20×20 */}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-[var(--content-muted)]" />
          </motion.div>
        </div>
      </button>

      {/* Collapsible panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] space-y-4">

              {/* Location filter */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                  <span className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-wide">Location / Court</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className={pillClass(selectedLocation === "")} onClick={() => onLocationChange("")}>
                    All Courts
                  </button>
                  {courts?.map((court) => (
                    <button
                      key={court.title}
                      className={pillClass(selectedLocation === court.title)}
                      onClick={() => onLocationChange(selectedLocation === court.title ? "" : court.title)}
                    >
                      {court.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--border-subtle)]" />

              {/* Skill level filter — item 17: NTRP numeric labels */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[13px]">🎾</span>
                  <span className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-wide">NTRP Level</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className={pillClass(selectedSkill === "")} onClick={() => onSkillChange("")}>
                    All Levels
                  </button>
                  {SKILL_LEVELS.map(({ value, label }) => (
                    <button
                      key={value}
                      className={pillClass(selectedSkill === value)}
                      onClick={() => onSkillChange(selectedSkill === value ? "" : value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips summary (shown when closed and filters are active) */}
      {!open && activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLocation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-[11px] font-medium">
              <MapPin className="w-3 h-3" /> {selectedLocation}
              <button onClick={() => onLocationChange("")} className="ml-0.5 hover:opacity-70" aria-label="Remove location filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSkill && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-[11px] font-medium">
              🎾 {SKILL_LEVELS.find(s => s.value === selectedSkill)?.label || selectedSkill}
              <button onClick={() => onSkillChange("")} className="ml-0.5 hover:opacity-70" aria-label="Remove skill filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
