const parks = [
  "Whiteoak's Park",
  "Dellwood Park",
  "West Acres Park",
  "Hunter's Green Park",
];

export default function LocationSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (loc: string) =>
    selected.includes(loc)
      ? onChange(selected.filter((l) => l !== loc))
      : onChange([...selected, loc]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-md font-bold text-gray-700 dark:text-gray-300">Select Locations</span>
    <div className="flex flex-wrap gap-3">
      {parks.map((park) => {
        const isSelected = selected.includes(park);
        return (
          <button
            key={park}
            onClick={() => toggle(park)}
            type="button"
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition
              ${
                isSelected
                 ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-white dark:hover:bg-green-400"
              }
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          >
            {park} {isSelected && <span className="ml-1">✕</span>}
          </button>
        );
        
      })}
    </div>
    </div>
  );
}
