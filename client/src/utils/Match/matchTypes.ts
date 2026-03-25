/**
 * Canonical types for the Playdates match lifecycle.
 * Single source of truth for status strings, notification types, and helpers.
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

// ---------------------------------------------------------------------------
// Legacy string handling (for existing Firestore data)
// ---------------------------------------------------------------------------

const LEGACY_STATUS: Record<string, MatchStatus> = {
    "Time-Preposed": "time_proposed",
};

const LEGACY_NOTIFICATION_TYPE: Record<string, NotificationType> = {
    "match proposal result": "match_result",
    "match preposal result": "match_result",
};

const LEGACY_PROFILE_TYPE: Record<string, ProfileMatchDocType> = {
    "match proposal": "match_proposal",
    "created match": "created_match",
};

/** Normalize a match status string, mapping legacy values to canonical form. */
export const normalizeMatchStatus = (status: string | undefined): MatchStatus | undefined => {
    if (!status) return undefined;
    return LEGACY_STATUS[status] ?? (status as MatchStatus);
};

/** Check if a notification type represents a match result (handles legacy strings). */
export const isMatchResultNotification = (type: string): boolean => {
    return type === "match_result" || type in LEGACY_NOTIFICATION_TYPE;
};

/** Check if a profile match type is a "created match" (handles legacy strings). */
export const isCreatedMatchType = (type: string): boolean => {
    const normalized = LEGACY_PROFILE_TYPE[type] ?? type;
    return normalized === "created_match";
};

/** Whether the status represents an actionable invite (needs user response). */
export const isActionableInvite = (status: string | undefined): boolean => {
    if (!status) return false;
    return status === "pending" || status === "time_proposed" || status === "Time-Preposed";
};
