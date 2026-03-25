import { useCourt } from "@/context/courtContext";
import { courtType, LocationStorageType } from "@/utils/TYPE";
import { MapPin, Search, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LocationSelector({
  selected,
  onChange,
  type,
}: {
  selected: LocationStorageType[];
  onChange: (val: LocationStorageType[]) => void;
  type: string;
}) {
  const { courts } = useCourt();
  const [search, setSearch] = useState("");

  if (!courts) return null;

  const isSelected = (courtId: string) => selected.some((loc) => loc.courtId === courtId);

  const toggle = (court: courtType) => {
    const alreadySelected = isSelected(court.id);
    if (alreadySelected) {
      onChange(selected.filter((loc) => loc.courtId !== court.id));
    } else {
      if (type === "Match-Creation" && selected.length === 1) {
        toast.error("Only one court can be selected");
        return;
      }
      onChange([...selected, { name: court.title, courtId: court.id }]);
    }
  };

  const filteredCourts = courts.filter(
    (court) =>
      court.title.toLowerCase().includes(search.toLowerCase()) ||
      court.location?.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[var(--accent-green)]" />
        <span className="text-[13px] font-semibold text-[var(--content-primary)]">
          Select {type === "Match-Creation" ? "Court" : "Locations"}
        </span>
        {selected.length > 0 && (
          <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
        <input
          type="text"
          placeholder="Search courts by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9 py-2.5 text-[13px]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--content-muted)] hover:text-[var(--content-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Court cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {filteredCourts.length === 0 ? (
          <div className="col-span-2 text-center py-6 text-[var(--content-muted)] text-[13px]">
            No courts found
          </div>
        ) : (
          filteredCourts.map((court) => {
            const sel = isSelected(court.id);
            return (
              <button
                key={court.id}
                onClick={() => toggle(court)}
                type="button"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  sel
                    ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]"
                    : "bg-[var(--surface-inset)] border-[var(--border-subtle)] text-[var(--content-secondary)] hover:border-[var(--accent-green)]/50 hover:text-[var(--content-primary)]"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sel ? "bg-[var(--accent-green)]/20" : "bg-[var(--surface-raised)]"}`}>
                  {sel ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)]" />
                  ) : (
                    <MapPin className="w-4 h-4 text-[var(--content-muted)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{court.title}</p>
                  {court.location?.address && (
                    <p className="text-[11px] opacity-70 truncate">{court.location.address}</p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((loc) => (
            <span
              key={loc.courtId}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[11px] font-semibold border border-[var(--accent-green)]/20"
            >
              <MapPin className="w-3 h-3" />
              {loc.name}
              <button
                type="button"
                onClick={() => onChange(selected.filter((s) => s.courtId !== loc.courtId))}
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
