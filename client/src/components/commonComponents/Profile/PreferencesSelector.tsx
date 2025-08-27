import toast from "react-hot-toast";

const options = ["Singles", "Co-ed Singles", "Mixed Doubles", "Doubles"];

export default function PreferencesSelector({
  selected,
  onChange,
  type
}: {
  selected: string[];
  onChange: (val: string[]) => void;
  type: string
}) {
  const toggle = (pref: string) => {
    const alreadySelected = selected.includes(pref);

    if (alreadySelected) {
      onChange(selected.filter((p) => p !== pref))
    }
    else {
      if (type == "Match-Creation" && selected.length == 1) {
        toast.error("You can Only Select one");
        return
      }
      onChange([...selected, pref]);
    }
  }


  return (
    <div className="flex flex-col gap-2">
      <span className="text-md font-bold text-gray-700 dark:text-gray-300"> Select Preferences</span>

      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);

          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition shadow-sm
            ${isSelected
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-white  dark:hover:bg-green-700"
                }
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
            >
              {opt} {isSelected && <span className="ml-1">✕</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
