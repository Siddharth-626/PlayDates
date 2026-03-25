import React from "react";
import { Clock } from "lucide-react";

type Props = {
    time: string;
    onChange: (time: string) => void;
};

export default function TimePicker({ time, onChange }: Props) {
    let currentHour = "";
    let currentMinute = "";
    let currentPeriod = "AM";

    if (time) {
        const ampmMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (ampmMatch) {
            currentHour = ampmMatch[1];
            currentMinute = ampmMatch[2];
            currentPeriod = ampmMatch[3].toUpperCase();
        } else {
            const parts = time.split(":");
            if (parts.length === 2) {
                let h = parseInt(parts[0], 10);
                currentMinute = parts[1];
                if (h === 0) { currentHour = "12"; currentPeriod = "AM"; }
                else if (h < 12) { currentHour = String(h); currentPeriod = "AM"; }
                else if (h === 12) { currentHour = "12"; currentPeriod = "PM"; }
                else { currentHour = String(h - 12); currentPeriod = "PM"; }
            }
        }
    }

    const buildTimeString = (hour: string, minute: string, period: string) => {
        if (!hour || !minute) return "";
        return `${hour}:${minute} ${period}`;
    };

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--content-muted)]">
                <Clock className="w-4 h-4 text-[var(--accent-green)]" />
                Select Start Time
            </div>

            {/* Hour row */}
            <div>
                <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-wide mb-1.5">Hour</p>
                <div className="flex flex-wrap gap-1.5">
                    {hours.map((h) => (
                        <button
                            key={h}
                            type="button"
                            onClick={() => onChange(buildTimeString(h, currentMinute || "00", currentPeriod))}
                            className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all border ${
                                currentHour === h
                                    ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] shadow-sm"
                                    : "bg-[var(--surface-inset)] text-[var(--content-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
                            }`}
                        >
                            {h}
                        </button>
                    ))}
                </div>
            </div>

            {/* Minute row */}
            <div>
                <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-wide mb-1.5">Minute</p>
                <div className="flex flex-wrap gap-1.5">
                    {minutes.map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => onChange(buildTimeString(currentHour || "12", m, currentPeriod))}
                            className={`w-12 h-9 rounded-lg text-[13px] font-semibold transition-all border ${
                                currentMinute === m
                                    ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] shadow-sm"
                                    : "bg-[var(--surface-inset)] text-[var(--content-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
                            }`}
                        >
                            :{m}
                        </button>
                    ))}
                </div>
            </div>

            {/* AM/PM toggle */}
            <div>
                <p className="text-[11px] font-semibold text-[var(--content-muted)] uppercase tracking-wide mb-1.5">Period</p>
                <div className="flex gap-2">
                    {["AM", "PM"].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onChange(buildTimeString(currentHour || "12", currentMinute || "00", p))}
                            className={`flex-1 h-10 rounded-xl text-[14px] font-bold transition-all border ${
                                currentPeriod === p
                                    ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] shadow-glow-green"
                                    : "bg-[var(--surface-inset)] text-[var(--content-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            {time && (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20">
                    <Clock className="w-4 h-4 text-[var(--accent-green)]" />
                    <span className="text-[15px] font-bold text-[var(--accent-green)]">{time}</span>
                </div>
            )}
        </div>
    );
}
