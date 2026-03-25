import { Timer } from "lucide-react";

type DurationType = {
    duration: string;
    onChange: (duration: string) => void;
};

const options = [
    { label: "30 min", value: "30 min" },
    { label: "1 hr", value: "1 hour" },
    { label: "1.5 hrs", value: "1.5 hours" },
    { label: "2 hrs", value: "2 hours" },
];

const DurationSelector = ({ duration, onChange }: DurationType) => {
    return (
        <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--content-muted)]">
                <Timer className="w-4 h-4 text-[var(--accent-green)]" />
                Select Duration
            </div>
            <div className="grid grid-cols-4 gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold transition-all border text-center ${
                            duration === opt.value
                                ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] shadow-sm"
                                : "bg-[var(--surface-inset)] text-[var(--content-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            {duration && (
                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20">
                    <Timer className="w-4 h-4 text-[var(--accent-green)]" />
                    <span className="text-[14px] font-bold text-[var(--accent-green)]">{duration}</span>
                </div>
            )}
        </div>
    );
};

export default DurationSelector;
