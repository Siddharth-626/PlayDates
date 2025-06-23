const levels = ["2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];

export default function SkillLevelDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
   return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="skill-level"
        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        Skill Level
      </label>

      <select
        id="skill-level"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700
                   bg-white text-gray-900 dark:bg-gray-900 dark:text-white
                   focus:outline-none focus:border-green-600
                   focus:ring-2 focus:ring-green-200 dark:focus:ring-green-600
                   shadow-sm transition"
      >
        <option value="" disabled>
          Select your skill level
        </option>
        {levels.map((lvl) => (
          <option key={lvl} value={lvl}>
            {`Intermediate (${lvl})`}
          </option>
        ))}
      </select>
    </div>
  );
}
