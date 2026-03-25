import { LocationStorageType } from "@/utils/TYPE";
import { MapPin } from "lucide-react";

export default function LocationsSection({ locations }: { locations: LocationStorageType[] }) {
  return (
    <div>
      <h3 className="text-body font-semibold mb-2 text-[var(--content-primary)]">Preferred Courts</h3>
      <div className="flex flex-wrap gap-2">
        {locations.map(loc => (
          <span key={loc.name} className="inline-flex items-center gap-1.5 px-3 py-1 badge-green text-sm">
            <MapPin className="w-3 h-3" />{loc.name}
          </span>
        ))}
      </div>
    </div>
  );
}
