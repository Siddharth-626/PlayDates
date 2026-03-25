import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full lg:max-w-xl">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--content-muted)]" />
      <input
        type="text"
        placeholder="Search player by name..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-base pl-10 rounded-full"
      />
    </div>
  );
}