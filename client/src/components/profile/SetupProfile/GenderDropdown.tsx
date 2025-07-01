// components/ProfileSetup/GenderDropdown.tsx
const options = ["Male", "Female", "Other"];

export default function GenderDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
   return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="gender"
        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        Gender
      </label>

      <select
        id="gender"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-900
                   text-gray-900 dark:text-white
                   focus:outline-none focus:border-green-600
                   focus:ring-2 focus:ring-green-200 dark:focus:ring-green-600
                   shadow-sm transition"
      >
        <option value="">Select Gender</option>
        {options.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
