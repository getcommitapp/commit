import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("computeGoalState - basic", () => {
  const tz = "Europe/Zurich";

  it("checkin without end shows modal during grace", () => {
    const now = new Date("2025-01-01T06:59:40.000Z");
    const input = {
      tz,
      now,
      goal: {
        id: "g1",
        dueStartTime: "2025-01-01T07:00:00.000Z",
        verificationMethod: { method: "checkin", graceTimeSeconds: 60 },
      },
    } as const;
    const resBefore = computeGoalState(input);
    expect(resBefore.state).toBe("scheduled");

    const inGrace = computeGoalState({
      ...input,
      now: new Date("2025-01-01T07:00:30.000Z"),
    });
    expect(inGrace.state).toBe("window_open");
    expect(inGrace.flags.showCheckinModal).toBe(true);
  });

  it("movement with end exposes latestStart and timer visibility", () => {
    const input = {
      tz,
      now: new Date("2025-01-01T06:00:00.000Z"),
      goal: {
        id: "g2",
        dueStartTime: "2025-01-01T07:00:00.000Z",
        dueEndTime: "2025-01-01T08:00:00.000Z",
        verificationMethod: { method: "movement", durationSeconds: 1200 }, // 20m
      },
    } as const;
    const res = computeGoalState(input);
    expect(res.flags.showTimer).toBe(true);
    expect(res.windows.latestStart).toBeInstanceOf(Date);
  });
});
