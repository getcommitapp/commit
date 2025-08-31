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
    expect(before.actions.length).toBe(1);

    const during = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:00:30.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");
    expect(during.actions[0].presentation).toBe("modal");

    const after = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:01:30.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
    expect(after.actions.length).toBe(1);
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
    expect(before.actions[0].enabled).toBe(false);

    const during = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:05:00.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");
    expect(during.actions[0].enabled).toBe(true);

    const after = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:11:00.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
    expect(after.actions[0].enabled).toBe(false);
  });

  it("approved -> passed immediately for checkin", () => {
    const goal = {
      id: "g-checkin-3",
      dueStartTime: "2025-01-01T07:00:00.000Z",
      verificationMethod: { method: "checkin", graceTimeSeconds: 60 },
    } as const;
    const res = computeGoalState({
      tz,
      now: new Date("2025-01-01T07:00:10.000Z"),
      goal,
      occurrenceVerification: { status: "approved" },
    });
    expect(res.state).toBe("passed");
  });
});
