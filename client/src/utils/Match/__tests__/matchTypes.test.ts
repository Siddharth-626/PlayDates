/**
 * Unit tests for matchTypes canonical types and helpers.
 */

import {
    normalizeMatchStatus,
    isMatchResultNotification,
    isCreatedMatchType,
    isActionableInvite,
    TERMINAL_STATUSES,
} from "../matchTypes";

describe("normalizeMatchStatus", () => {
    it("maps legacy 'Time-Preposed' to 'time_proposed'", () => {
        expect(normalizeMatchStatus("Time-Preposed")).toBe("time_proposed");
    });

    it("passes through canonical statuses unchanged", () => {
        expect(normalizeMatchStatus("accepted")).toBe("accepted");
        expect(normalizeMatchStatus("proposed")).toBe("proposed");
        expect(normalizeMatchStatus("open")).toBe("open");
        expect(normalizeMatchStatus("completed")).toBe("completed");
    });

    it("returns undefined for undefined input", () => {
        expect(normalizeMatchStatus(undefined)).toBeUndefined();
    });
});

describe("isMatchResultNotification", () => {
    it("recognizes canonical 'match_result'", () => {
        expect(isMatchResultNotification("match_result")).toBe(true);
    });

    it("recognizes legacy 'match proposal result'", () => {
        expect(isMatchResultNotification("match proposal result")).toBe(true);
    });

    it("recognizes legacy typo 'match preposal result'", () => {
        expect(isMatchResultNotification("match preposal result")).toBe(true);
    });

    it("rejects unrelated types", () => {
        expect(isMatchResultNotification("playmates_request")).toBe(false);
        expect(isMatchResultNotification("random")).toBe(false);
    });
});

describe("isCreatedMatchType", () => {
    it("recognizes canonical 'created_match'", () => {
        expect(isCreatedMatchType("created_match")).toBe(true);
    });

    it("recognizes legacy 'created match'", () => {
        expect(isCreatedMatchType("created match")).toBe(true);
    });

    it("rejects 'match_proposal'", () => {
        expect(isCreatedMatchType("match_proposal")).toBe(false);
    });
});

describe("isActionableInvite", () => {
    it("returns true for 'pending'", () => {
        expect(isActionableInvite("pending")).toBe(true);
    });

    it("returns true for 'time_proposed'", () => {
        expect(isActionableInvite("time_proposed")).toBe(true);
    });

    it("returns true for legacy 'Time-Preposed'", () => {
        expect(isActionableInvite("Time-Preposed")).toBe(true);
    });

    it("returns false for 'accepted'", () => {
        expect(isActionableInvite("accepted")).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isActionableInvite(undefined)).toBe(false);
    });
});

describe("TERMINAL_STATUSES", () => {
    it("contains accepted, rejected, completed, expired, cancelled", () => {
        expect(TERMINAL_STATUSES).toContain("accepted");
        expect(TERMINAL_STATUSES).toContain("rejected");
        expect(TERMINAL_STATUSES).toContain("completed");
        expect(TERMINAL_STATUSES).toContain("expired");
        expect(TERMINAL_STATUSES).toContain("cancelled");
    });

    it("does not contain proposed or open", () => {
        expect(TERMINAL_STATUSES).not.toContain("proposed");
        expect(TERMINAL_STATUSES).not.toContain("open");
    });
});
