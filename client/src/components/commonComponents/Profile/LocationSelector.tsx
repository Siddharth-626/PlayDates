import { useCourt } from "@/context/courtContext";
import { courtType, LocationStorageType } from "@/utils/TYPE";
import { Search } from "lucide-react";
import { useState } from "react";

export default function LocationSelector({
  selected,
  onChange,
}: {
  selected: LocationStorageType[];                     // List of selected locations as objects
  onChange: (val: LocationStorageType[]) => void;      // Same format in handler
}) {
  const { courts } = useCourt();

  const [search, setSearch] = useState('');

  if (!courts) return null;

  const isSelected = (courtId: string) =>
    selected.some((loc) => loc.courtId === courtId);

  const toggle = (court: courtType) => {
    const alreadySelected = isSelected(court.id);

    if (alreadySelected) {
      onChange(selected.filter((loc) => loc.courtId !== court.id));
    } else {
      onChange([
        ...selected,
        { name: court.title, courtId: court.id },
      ]);
    }
  };

  const filteredCourts = courts.filter(
    (court) =>
      court.title.toLowerCase().includes(search.toLowerCase()) ||
      court.location.address.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-2">
      <span className="text-md font-bold text-gray-700 dark:text-gray-300">
        Select Locations
      </span>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search courts by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border shadow-sm dark:bg-gray-900 dark:text-white"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>

      <div className="flex flex-wrap gap-3">
        {filteredCourts.length === 0 ? (
          <p>No courts found</p>
        ) : (
          filteredCourts.slice(0, 4).map((court) => {
            const selectedNow = isSelected(court.id);

            return (
              <button
                key={court.id}
                onClick={() => toggle(court)}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${selectedNow
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-white dark:hover:bg-green-400"
                  } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
              >
                {court.title} {selectedNow && <span className="ml-1">✕</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
