import React, { useEffect, useMemo, useState } from "react";

export type TeamKey = "team1" | "team2";

export type TieBreak = {
    points: [number, number]; // [team1, team2]
};

export type SetScore = {
    games: [number, number]; // [team1, team2]
    tiebreak: TieBreak | null; // only when 7–6 / 6–7
};

export type MatchScorePayload = {
    format: "REGULAR_SET"; // can be extended later
    sets: SetScore[];
    winner: TeamKey; // overall match winner
};

export type ScoreSelectorPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MatchScorePayload) => void;
    teamNames?: { team1: string; team2: string };
    initial?: Partial<MatchScorePayload>;
};

// ---------- Helpers (validation + utils) ----------
const clampInt = (v: any, min = 0, max = 99) => {
    const n = Number.isFinite(+v) ? Math.floor(+v) : 0;
    return Math.max(min, Math.min(max, n));
};

const DEFAULT_SET: SetScore = { games: [0, 0], tiebreak: null };

/** Regular set rules:
 * - Winner needs 6 games with a 2-game margin (so 6–0..6–4) OR 7–5 without TB
 * - When 6–6, a 7-point tie-break is played (win by 2). Final set games become 7–6 for the TB winner
 */
export function validateRegularSet(set: SetScore) {
    const [a, b] = set.games;
    const max = Math.max(a, b);
    const min = Math.min(a, b);

    // Unfilled
    if (a === 0 && b === 0 && !set.tiebreak) return { valid: false, reason: "Enter games for both teams." };

    // Basic bounds
    if (a < 0 || b < 0 || a > 7 || b > 7) return { valid: false, reason: "Games must be between 0 and 7." };

    // No ties allowed (except intermediate 6–6 before TB)
    if (a === b && a !== 6) return { valid: false, reason: "Set cannot end in a draw." };

    // Straight wins to 6 (by 2)
    if ((max === 6 && max - min >= 2) && (max !== 6 || min <= 4)) {
        if (set.tiebreak) return { valid: false, reason: "No tie-break when set ends 6 by 2." };
        return { valid: true, needsTB: false };
    }

    // 7–5 without TB
    if ((max === 7 && min === 5)) {
        if (set.tiebreak) return { valid: false, reason: "No tie-break in a 7–5 set." };
        return { valid: true, needsTB: false };
    }

    // 6–6 requires a tie-break that ends 7–6 for the winner
    if (a === 7 && b === 6) {
        // team1 won TB; TB must be present and team1 TB > team2 TB by 2, >=7
        if (!set.tiebreak) return { valid: false, reason: "Add tie-break points for 7–6." };
        const [ta, tb] = set.tiebreak.points;
        if (ta < 7 || ta - tb < 2) return { valid: false, reason: "Tie-break must be won by 2, min 7." };
        return { valid: true, needsTB: true };
    }

    if (a === 6 && b === 7) {
        if (!set.tiebreak) return { valid: false, reason: "Add tie-break points for 6–7." };
        const [ta, tb] = set.tiebreak.points;
        if (tb < 7 || tb - ta < 2) return { valid: false, reason: "Tie-break must be won by 2, min 7." };
        return { valid: true, needsTB: true };
    }

    // Everything else invalid for this format
    return { valid: false, reason: "Invalid game combination for a Regular Set." };
}

function setWinner(set: SetScore): TeamKey | null {
    const [a, b] = set.games;
    if (a === b) return null; // only 6–6 intermediate isn't allowed here as final
    return a > b ? "team1" : "team2";
}

function computeMatchWinner(sets: SetScore[]): TeamKey | null {
    let a = 0, b = 0;
    for (const s of sets) {
        const w = setWinner(s);
        if (!w) continue;
        if (w === "team1") a++; else b++;
    }
    if (a === b) return null;
    return a > b ? "team1" : "team2";
}

// ---------- UI primitives ----------
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900">
                {children}
                </div>
    );
}

function CardToggle({
    label,
    active,
    onClick,
    subtitle,
}: { label: string; active: boolean; onClick: () => void; subtitle?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group w-full rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-green-500 ${active
                    ? "border-green-500/60 bg-green-50 dark:bg-green-950/30"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded-full border ${active ? "bg-green-500 border-green-500" : "border-zinc-400"}`} />
                <div>
                    <div className={`font-semibold ${active ? "text-green-700 dark:text-green-300" : ""}`}>{label}</div>
                    {subtitle && <div className="text-xs text-zinc-500">{subtitle}</div>}
                </div>
                {active && window.innerWidth >= 768 && (
                    <span className="ml-auto rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">WINNER</span>
                )}
            </div>
        </button>
    );
}

function NumberPill({ value, onChange, disabled, ariaLabel }: { value: number; onChange: (n: number) => void; disabled?: boolean; ariaLabel: string }) {
    return (
        <div className="flex items-center gap-2">
            <button disabled={disabled} onClick={() => onChange(Math.max(0, value - 1))} className="rounded-xl border px-2 py-1 disabled:opacity-40">−</button>
            <input
                aria-label={ariaLabel}
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={(e) => onChange(clampInt(e.target.value, 0, 99))}
                className="w-12 rounded-xl border bg-white px-3 py-2 text-center text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-900"
            />
            <button disabled={disabled} onClick={() => onChange(value + 1)} className="rounded-xl border px-2 py-1 disabled:opacity-40">+</button>
        </div>
    );
}

function TinyTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`rounded-full px-3 py-1 text-sm transition ${active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
        >
            {children}
        </button>
    );
}

// ---------- Main component ----------
export default function ScoreSelectorPopup({ isOpen, onClose, onSubmit, teamNames = { team1: "You", team2: "Opponent" }, initial }: ScoreSelectorPopupProps) {
    const [winner, setWinner] = useState<TeamKey>(initial?.winner ?? "team2");
    const [format, setFormat] = useState<"REGULAR_SET">("REGULAR_SET");
    const [sets, setSets] = useState<SetScore[]>(initial?.sets && initial.sets.length ? initial.sets : [{ ...DEFAULT_SET }]);
    const [activeView, setActiveView] = useState<"SET" | "TB">("SET");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If sets imply a clear winner, pre-select it
        const implied = computeMatchWinner(sets);
        if (implied) setWinner(implied);
    }, [sets]);

    // ----- Mutators -----
    const updateSet = (index: number, next: Partial<SetScore>) => {
        setSets((prev) => prev.map((s, i) => (i === index ? { ...s, ...next } : s)));
    };

    const updateGames = (index: number, team: TeamKey, value: number) => {
        setSets((prev) =>
            prev.map((s, i) => {
                if (i !== index) return s;
                const next: SetScore = { ...s, games: [...s.games] as [number, number] };
                if (team === "team1") next.games[0] = clampInt(value, 0, 7);
                else next.games[1] = clampInt(value, 0, 7);

                // Auto-clear TB unless 7–6/6–7
                const [a, b] = next.games;
                if (!((a === 7 && b === 6) || (a === 6 && b === 7))) next.tiebreak = null;
                return next;
            })
        );
    };

    const updateTB = (index: number, team: TeamKey, value: number) => {
        setSets((prev) =>
            prev.map((s, i) => {
                if (i !== index) return s;
                const tb = s.tiebreak ?? { points: [0, 0] as [number, number] };
                const nextTB: TieBreak = { points: [...tb.points] as [number, number] };
                if (team === "team1") nextTB.points[0] = clampInt(value, 0, 99);
                else nextTB.points[1] = clampInt(value, 0, 99);
                return { ...s, tiebreak: nextTB };
            })
        );
    };

    const addSet = () => setSets((s) => (s.length >= 5 ? s : [...s, { ...DEFAULT_SET }]))
    const removeSet = (index: number) => setSets((s) => s.filter((_, i) => i !== index))

    // ----- Validation -----
    const validation = useMemo(() =>
        sets.map((s) => validateRegularSet(s)),
        [sets]);

    const allValid = validation.every((v) => v.valid);

    const handleSubmit = () => {
        // Check validity
        for (let i = 0; i < sets.length; i++) {
            const v = validation[i];
            if (!v.valid) {
                setError(`Set ${i + 1}: ${v.reason}`);
                return;
            }
        }
        setError(null);

        const payload: MatchScorePayload = {
            format,
            sets,
            winner,
        };

        onSubmit(payload);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Report Score</h2>
                    <button onClick={onClose} className="rounded-xl border px-2 py-1">✕</button>
                </div>

                {/* Choose Winner */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Choose a winner</div>
                    <div className="grid grid-cols-2 gap-3">
                        <CardToggle
                            label={teamNames.team1}
                            subtitle="Team 1"
                            active={winner === "team1"}
                            onClick={() => setWinner("team1")}
                        />
                        <CardToggle
                            label={teamNames.team2}
                            subtitle="Team 2"
                            active={winner === "team2"}
                            onClick={() => setWinner("team2")}
                        />
                    </div>
                </div>

                {/* Scoring Format */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Scoring Format</div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                        <div className="min-w-0">
                            <div className="font-medium">1 Regular Set</div>
                            <p className="text-xs text-zinc-500">First to 6 games with a 2-game lead, tie-break at 6–6 (7-point, win by 2).</p>
                        </div>
                        {/* Placeholder for extensibility */}
                        <select
                            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm dark:bg-zinc-900"
                            value={format}
                            onChange={() => setFormat("REGULAR_SET")}
                        >
                            <option value="REGULAR_SET">1 Regular Set</option>
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">View:</span>
                    <TinyTab active={activeView === "SET"} onClick={() => setActiveView("SET")}>Set Score</TinyTab>
                    <TinyTab active={activeView === "TB"} onClick={() => setActiveView("TB")}>Tie‑breaker Score</TinyTab>
                </div>

                {/* Sets Editor */}
                <div className="space-y-4">
                    {sets.map((s, idx) => {
                        const [a, b] = s.games;
                        const v = validation[idx];
                        const tbEligible = (a === 7 && b === 6) || (a === 6 && b === 7);
                        const showTB = activeView === "TB" || tbEligible;

                        return (
                            <div key={idx} className="rounded-2xl border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="text-sm font-semibold">Set {idx + 1}</div>
                                    {sets.length > 1 && (
                                        <button onClick={() => removeSet(idx)} className="text-xs text-red-600 underline">Remove</button>
                                    )}
                                </div>

                                {/* Games */}
                                <div className={`grid grid-cols-2 items-center gap-4 ${activeView === "SET" ? "" : "opacity-60"}`}>
                                    <div className="space-y-1">
                                        <div className="text-xs text-zinc-500">{teamNames.team1}</div>
                                        <NumberPill ariaLabel={`Set ${idx + 1} ${teamNames.team1} games`} value={a} onChange={(n) => updateGames(idx, "team1", n)} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-zinc-500">{teamNames.team2}</div>
                                        <NumberPill ariaLabel={`Set ${idx + 1} ${teamNames.team2} games`} value={b} onChange={(n) => updateGames(idx, "team2", n)} />
                                    </div>
                                </div>

                                {/* Tie-break */}
                                {showTB && (
                                    <div className="mt-4 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                        <div className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">Tie‑breaker (first to 7, win by 2)</div>
                                        <div className="grid grid-cols-2 items-center gap-4">
                                            <div className="space-y-1">
                                                <div className="text-xs text-zinc-500">{teamNames.team1}</div>
                                                <NumberPill ariaLabel={`Set ${idx + 1} ${teamNames.team1} TB points`} value={s.tiebreak?.points[0] ?? 0} onChange={(n) => updateTB(idx, "team1", n)} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-zinc-500">{teamNames.team2}</div>
                                                <NumberPill ariaLabel={`Set ${idx + 1} ${teamNames.team2} TB points`} value={s.tiebreak?.points[1] ?? 0} onChange={(n) => updateTB(idx, "team2", n)} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Validation message */}
                                <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-300">
                                    {v.valid ? (
                                        <span className="text-green-600">Looks good.</span>
                                    ) : (
                                        <span className="text-amber-600">{v.reason}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add set */}
                    <div className="flex items-center justify-between">
                        <button onClick={addSet} className="rounded-xl border px-3 py-2 text-sm">+ Add another set</button>
                        <div className="text-xs text-zinc-500">Max 5 sets.</div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button onClick={onClose} className="rounded-xl border px-4 py-2">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!allValid}
                        className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                    >
                        Save Score
                    </button>
                </div>
            </div>
        </Modal>
    );
}