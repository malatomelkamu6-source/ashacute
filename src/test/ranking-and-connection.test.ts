import { describe, expect, it } from "vitest";
import { rankRows } from "../lib/results";
import { backOnline, DISCONNECT_GRACE_SEC } from "../lib/exam-timing";

describe("results matrix ranking", () => {
  it("ranks highest total first, shares ties and skips students without marks", () => {
    const ranked = rankRows([
      { id: "a", total: 480, hasMarks: true },
      { id: "b", total: 450, hasMarks: true },
      { id: "c", total: 450, hasMarks: true },
      { id: "d", total: 300, hasMarks: true },
      { id: "e", total: 0, hasMarks: false },
    ]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 2, 4, null]);
  });
});

describe("connection loss", () => {
  it("freezes a timer after one minute without contact", () => {
    expect(DISCONNECT_GRACE_SEC).toBe(60);
  });
  it("shows a paused student as back online only after they report again", () => {
    const now = Date.parse("2026-11-04T10:05:00Z");
    expect(backOnline("2026-11-04T10:04:55Z", "2026-11-04T10:01:00Z", now)).toBe(true);
    expect(backOnline("2026-11-04T10:01:00Z", "2026-11-04T10:01:00Z", now)).toBe(false);
    expect(backOnline(null, "2026-11-04T10:01:00Z", now)).toBe(false);
  });
});
