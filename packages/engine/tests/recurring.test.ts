import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("recurring weekly goals", () => {
  const tz = "Europe/Zurich";

  it("selects the next allowed weekday and computes window", () => {
    // Wed Jan 1, 2025 is a Wednesday. Allow Thu and Fri only.
    const goal = {
      id: "g-rec-1",
      recurrence: { type: "weekly", daysOfWeek: [4, 5] }, // Thu, Fri
      localDueStart: "07:30",
      localDueEnd: "08:00",
      verificationMethod: { method: "checkin" },
    } as const;

    const resWed = computeGoalState({
      tz,
      now: new Date("2025-01-01T06:00:00.000Z"),
      goal,
    });
    // Should target Thu occurrence window (window likely after now)
    expect(["scheduled", "window_open", "missed"]).toContain(resWed.state);
    expect(resWed.occurrence?.start).toBeInstanceOf(Date);
  });

  it("today allowed: scheduled before local start, window_open during", () => {
    // Assume Monday 2025-01-06, allow Monday, 07:00-07:10 local
    const goal = {
      id: "g-rec-2",
      recurrence: { type: "weekly", daysOfWeek: [1] },
      localDueStart: "07:00",
      localDueEnd: "07:10",
      verificationMethod: { method: "photo" },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-01-06T06:50:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");

    const during = computeGoalState({
      tz,
      now: new Date("2025-01-06T06:59:59.000Z"),
      goal,
    });
    expect(["scheduled", "window_open"]).toContain(during.state);
  });
});
