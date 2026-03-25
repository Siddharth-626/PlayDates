/**
 * Canonical types for the Playdates match lifecycle (server-side).
 * Mirrors client/src/utils/Match/matchTypes.ts for consistency.
 */

/** Root match document status */
export type MatchStatus =
    | "proposed"
    | "open"
    | "created"
    | "time_proposed"
    | "accepted"
    | "rejected"
    | "completed"
    | "expired"
    | "cancelled";

/** Player status within the match players array */
export type PlayerStatus = "owner" | "pending" | "accepted" | "rejected";

/** Notification type strings */
export type NotificationType = "match_result" | "playmates_request";

/** Profile match document type field */
export type ProfileMatchDocType = "match_proposal" | "created_match";

/** Terminal statuses — no further transitions allowed */
export const TERMINAL_STATUSES: readonly MatchStatus[] = [
    "accepted", "rejected", "completed", "expired", "cancelled",
] as const;

/**
 * Build a profile match document for fanout.
 * Includes denormalized fields so the client can filter without extra reads.
 */
export const buildProfileMatchDoc = (
    matchId: string,
    matchData: Record<string, any>,
    playerStatus: string,
) => ({
    type: (matchData.status === "proposed" ? "match_proposal" : "created_match") as ProfileMatchDocType,
    matchId,
    isRead: false,
    status: playerStatus,
    matchStatus: matchData.status as MatchStatus,
    date: matchData.date ?? null,
    startTime: matchData.startTime ?? null,
    endTime: matchData.endTime ?? null,
    courtId: matchData.courtId ?? null,
    MatchType: matchData.MatchType ?? null,
    host: matchData.host ?? null,
});
