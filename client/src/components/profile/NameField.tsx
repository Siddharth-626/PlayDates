export default function NameField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
 return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="name"
        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        Name
      </label>

      <input
        id="name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your name"
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-900
                   text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:border-green-600 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-600
                   outline-none transition"
      />
    </div>
  );
}
