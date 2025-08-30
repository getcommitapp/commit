import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("photo method", () => {
  const tz = "Europe/Zurich";

  it("no end: scheduled, window_open during grace, missed after", () => {
    const goal = {
      id: "g-photo-1",
      dueStartTime: "2025-02-01T07:00:00.000Z",
      verificationMethod: { method: "photo", graceTimeSeconds: 90 },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-02-01T06:59:50.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");

    const during = computeGoalState({
      tz,
      now: new Date("2025-02-01T07:01:00.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");

    const after = computeGoalState({
      tz,
      now: new Date("2025-02-01T07:02:31.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
  });

  it("with end: scheduled, window_open during window, missed after", () => {
    const goal = {
      id: "g-photo-2",
      dueStartTime: "2025-02-01T07:00:00.000Z",
      dueEndTime: "2025-02-01T07:15:00.000Z",
      verificationMethod: { method: "photo" },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-02-01T06:30:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");

    const during = computeGoalState({
      tz,
      now: new Date("2025-02-01T07:10:00.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");

    const after = computeGoalState({
      tz,
      now: new Date("2025-02-01T07:16:00.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
  });
});
