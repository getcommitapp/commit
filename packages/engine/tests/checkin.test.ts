import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("checkin method", () => {
  const tz = "Europe/Zurich";

  it("no end: scheduled before, modal during grace, missed after", () => {
    const goal = {
      id: "g-checkin-1",
      dueStartTime: "2025-01-01T07:00:00.000Z",
      verificationMethod: { method: "checkin", graceTimeSeconds: 60 },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-01-01T06:59:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");
    expect(before.flags.showCheckinModal).toBe(false);

    const during = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:00:30.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");
    expect(during.flags.showCheckinModal).toBe(true);

    const after = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:01:30.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
    expect(after.flags.showCheckinModal).toBe(false);
  });

  it("with end: scheduled before, button during window, missed after end", () => {
    const goal = {
      id: "g-checkin-2",
      dueStartTime: "2025-01-01T07:00:00.000Z",
      dueEndTime: "2025-01-01T07:10:00.000Z",
      verificationMethod: { method: "checkin" },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-01-01T06:59:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");
    expect(before.flags.showCheckinButton).toBe(false);

    const during = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:05:00.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");
    expect(during.flags.showCheckinButton).toBe(true);

    const after = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:11:00.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
    expect(after.flags.showCheckinButton).toBe(false);
  });
});
