import { describe, it, expect } from "vitest";
import { computeGoalState } from "../src";

describe("movement method", () => {
  const tz = "Europe/Zurich";

  it("no end: scheduled before, ongoing during duration, passed after duration", () => {
    const goal = {
      id: "g-move-1",
      dueStartTime: "2025-03-01T07:00:00.000Z",
      verificationMethod: { method: "movement", durationSeconds: 600 },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-03-01T06:59:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");

    const during = computeGoalState({
      tz,
      now: new Date("2025-03-01T07:05:00.000Z"),
      goal,
    });
    expect(during.state).toBe("ongoing");
    expect(during.flags.isDurationBased).toBe(true);

    const after = computeGoalState({
      tz,
      now: new Date("2025-03-01T07:11:00.000Z"),
      goal,
    });
    expect(after.state).toBe("passed");
  });

  it("with end: timer visible until latestStart, missed if not started after latestStart, window open before latestStart", () => {
    const goal = {
      id: "g-move-2",
      dueStartTime: "2025-03-01T07:00:00.000Z",
      dueEndTime: "2025-03-01T08:00:00.000Z",
      verificationMethod: { method: "movement", durationSeconds: 1800 },
    } as const;

    const before = computeGoalState({
      tz,
      now: new Date("2025-03-01T06:50:00.000Z"),
      goal,
    });
    expect(before.state).toBe("scheduled");
    expect(before.flags.showTimer).toBe(true);

    const windowOpen = computeGoalState({
      tz,
      now: new Date("2025-03-01T07:10:00.000Z"),
      goal,
    });
    expect(windowOpen.state).toBe("window_open");
    expect(windowOpen.flags.showTimer).toBe(true);
    expect(windowOpen.windows.latestStart).toBeInstanceOf(Date);

    // After latestStart but before end: cannot start anymore -> missed
    const latestStart = windowOpen.windows.latestStart as Date;
    const afterLatest = computeGoalState({
      tz,
      now: new Date(latestStart.getTime() + 1000),
      goal,
    });
    expect(afterLatest.state).toBe("missed");
    expect(afterLatest.flags.showTimer).toBe(false);
  });
});
