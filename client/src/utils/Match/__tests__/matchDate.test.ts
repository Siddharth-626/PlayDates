/**
 * Unit tests for match classification utilities.
 * Run with: npx jest matchDate.test.ts (or via your test runner)
 */

import { isUpcomingMatch, isPastMatch, getMatchCalendarDate, floorToDay } from "../matchDate";

// Helper to create a mock match
const mkMatch = (overrides: Record<string, any> = {}) => ({
    status: "accepted",
    date: new Date("2026-03-25T00:00:00"),
    startTime: new Date("2026-03-25T10:00:00"),
    endTime: new Date("2026-03-25T11:00:00"),
    ...overrides,
});

describe("isUpcomingMatch", () => {
    it("returns true for accepted match whose endTime is in the future", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isUpcomingMatch(mkMatch(), now)).toBe(true);
    });

    it("returns false for accepted match whose endTime is in the past", () => {
        const now = new Date("2026-03-25T12:00:00");
        expect(isUpcomingMatch(mkMatch(), now)).toBe(false);
    });

    it("returns false for pending match even if endTime is future", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isUpcomingMatch(mkMatch({ status: "pending" }), now)).toBe(false);
    });

    it("returns false for completed match", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isUpcomingMatch(mkMatch({ status: "completed" }), now)).toBe(false);
    });

    it("returns false for rejected match", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isUpcomingMatch(mkMatch({ status: "rejected" }), now)).toBe(false);
    });

    it("uses startTime when endTime is missing", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isUpcomingMatch(mkMatch({ endTime: undefined }), now)).toBe(true);
    });

    it("returns false when no date/time and status is accepted", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(
            isUpcomingMatch({ status: "accepted" }, now)
        ).toBe(false);
    });

    it("handles Firestore Timestamp-like objects with toDate()", () => {
        const now = new Date("2026-03-25T09:00:00");
        const ts = { toDate: () => new Date("2026-03-25T11:00:00") };
        expect(isUpcomingMatch(mkMatch({ endTime: ts }), now)).toBe(true);
    });
});

describe("isPastMatch", () => {
    it("returns true for accepted match whose endTime is in the past", () => {
        const now = new Date("2026-03-25T12:00:00");
        expect(isPastMatch(mkMatch(), now)).toBe(true);
    });

    it("returns false for accepted match whose endTime is in the future", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isPastMatch(mkMatch(), now)).toBe(false);
    });

    it("returns false for pending match even if endTime is past", () => {
        const now = new Date("2026-03-25T12:00:00");
        expect(isPastMatch(mkMatch({ status: "pending" }), now)).toBe(false);
    });

    it("returns true for completed match regardless of time", () => {
        const now = new Date("2026-03-25T09:00:00"); // before endTime!
        expect(isPastMatch(mkMatch({ status: "completed" }), now)).toBe(true);
    });

    it("returns true for expired match regardless of time", () => {
        const now = new Date("2026-03-25T09:00:00");
        expect(isPastMatch(mkMatch({ status: "expired" }), now)).toBe(true);
    });

    it("match ending exactly at now is past (<=)", () => {
        const now = new Date("2026-03-25T11:00:00");
        expect(isPastMatch(mkMatch(), now)).toBe(true);
    });
});

describe("getMatchCalendarDate", () => {
    it("prefers date field", () => {
        const d = new Date("2026-04-01T00:00:00");
        expect(getMatchCalendarDate({ date: d })?.getTime()).toBe(d.getTime());
    });

    it("falls back to startTime", () => {
        const d = new Date("2026-04-01T10:00:00");
        expect(getMatchCalendarDate({ startTime: d })?.getTime()).toBe(d.getTime());
    });

    it("returns null for empty match", () => {
        expect(getMatchCalendarDate({})).toBeNull();
    });

    it("handles Firestore Timestamp-like objects", () => {
        const d = new Date("2026-04-01T00:00:00");
        const ts = { toDate: () => d };
        expect(getMatchCalendarDate({ date: ts })?.getTime()).toBe(d.getTime());
    });
});

describe("floorToDay", () => {
    it("strips time component", () => {
        const d = new Date("2026-03-25T14:30:45.123");
        const floored = floorToDay(d);
        expect(floored.getHours()).toBe(0);
        expect(floored.getMinutes()).toBe(0);
        expect(floored.getSeconds()).toBe(0);
        expect(floored.getMilliseconds()).toBe(0);
        expect(floored.getDate()).toBe(25);
    });
});
