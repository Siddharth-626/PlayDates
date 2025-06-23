// components/ProfileSetup/AgeCategoryDropdown.tsx
const options = ["Under 18", "18–35", "35+"];

export default function AgeCategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="age-category"
        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        Age Category
      </label>

      <select
        id="age-category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-900
                   text-gray-900 dark:text-white
                   focus:outline-none focus:border-green-600
                   focus:ring-2 focus:ring-green-200 dark:focus:ring-green-600
                   shadow-sm transition"
      >
        <option value="">Select Age</option>
        {options.map((age) => (
          <option key={age} value={age}>
            {age}
          </option>
        ))}
      </select>
    </div>
  );
}
