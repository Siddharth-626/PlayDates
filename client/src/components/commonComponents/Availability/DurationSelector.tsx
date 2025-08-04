
type DurationType = {
    duration: string;
    onChange: (duration: string) => void
}

const options = ["30 min", "1 hour", "1.5 hours", "2 hours"];

const DurationSelector = ({ duration, onChange }: DurationType) => {
    return (
        <div className="w-full">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                Select Duration
            </label>
            <select
                value={duration}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 rounded-md border dark:bg-gray-800 dark:text-white"
            >
                <option value="">-- Choose Duration --</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DurationSelector;