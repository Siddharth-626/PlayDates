export default function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <input
            type="text"
            placeholder="Search player by name..."
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full lg:max-w-xl px-4 py-2  hover:border-green-400 rounded-full border bg-slate-100 dark:bg-gray-700 text-black dark:text-white"
        />
    );
}