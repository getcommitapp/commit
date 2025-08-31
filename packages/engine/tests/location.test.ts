import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("location method (basic windowing)", () => {
  const tz = "Europe/Zurich";

  it("scheduled before window, window_open during, missed after end", () => {
    const goal = {
      id: "g-loc-1",
      dueStartTime: "2025-04-01T07:00:00.000Z",
      dueEndTime: "2025-04-01T07:30:00.000Z",
      verificationMethod: { method: "location" },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-04-01T06:50:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");

    const during = computeGoalState({
      tz,
      now: new Date("2025-04-01T07:10:00.000Z"),
      goal,
    });
    expect(during.state).toBe("window_open");

    const after = computeGoalState({
      tz,
      now: new Date("2025-04-01T07:31:00.000Z"),
      goal,
    });
    expect(after.state).toBe("missed");
  });
});
