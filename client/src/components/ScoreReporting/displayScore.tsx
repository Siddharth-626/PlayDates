"use client";

import { Trophy, Circle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type MatchScore = {
    format: "REGULAR_SET";
    sets: {
        games: [number, number];
        tiebreak: { points: [number, number] } | null;
    }[];
    winner: "team1" | "team2";
};

type Props = {
    score: MatchScore;
    teamNames?: { team1: string; team2: string };
};

export default function ScoreDisplay({ score, teamNames }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-lg mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Match Score
                </h2>
                <Trophy className="text-yellow-500 w-6 h-6" />
            </div>

            {/* Teams */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="font-semibold text-gray-700 dark:text-gray-200">
                    {teamNames?.team1 || "Team 1"}
                </div>
                <div className="text-gray-400 dark:text-gray-500">vs</div>
                <div className="font-semibold text-gray-700 dark:text-gray-200">
                    {teamNames?.team2 || "Team 2"}
                </div>
            </div>

            {/* Sets */}
            <div className="space-y-3">
                {score.sets.map((set, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Set {idx + 1}
                        </span>

                        <div className="flex items-center gap-6 text-lg font-bold">
                            <span
                                className={`${score.winner === "team1" && idx === score.sets.length - 1
                                        ? "text-green-600"
                                        : "text-gray-700 dark:text-gray-100"
                                    }`}
                            >
                                {set.games[0]}
                            </span>
                            <span
                                className={`${score.winner === "team2" && idx === score.sets.length - 1
                                        ? "text-green-600"
                                        : "text-gray-700 dark:text-gray-100"
                                    }`}
                            >
                                {set.games[1]}
                            </span>
                        </div>

                        {set.tiebreak && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                TB: {set.tiebreak.points[0]}-{set.tiebreak.points[1]}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Winner */}
            <div className="mt-5 flex justify-center items-center gap-2">
                {score.winner === "team1" ? (
                    <Circle className="text-green-500 w-5 h-5" />
                ) : (
                    <XCircle className="text-green-500 w-5 h-5" />
                )}
                <span className="font-semibold text-green-600">
                    Winner:{" "}
                    {score.winner === "team1"
                        ? teamNames?.team1 || "Team 1"
                        : teamNames?.team2 || "Team 2"}
                </span>
            </div>
        </motion.div>
    );
}
