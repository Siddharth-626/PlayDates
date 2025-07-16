import { LocationStorageType } from "@/utils/TYPE";

export default function LocationsSection({ locations }: { locations: LocationStorageType[] }) {
  return (
    <div className="flex items-center flex-col">
      <h3 className="text-xl font-semibold mb-1 text-green-700 dark:text-green-300">Preferred Courts</h3>
      <div className="flex flex-wrap gap-2">
        {locations.map(loc => (
          <span key={loc.name} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
            {loc.name}
          </span>
        ))}
      </div>
    </div>
  );
}
