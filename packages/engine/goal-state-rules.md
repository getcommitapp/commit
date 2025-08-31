### Goal state rules

This document defines how goal state is computed across the system, for both single and recurring goals. It is the canonical reference for server task scheduling and client UI behavior.

The rules here are designed to be implemented in a shared package (goal engine) and used by both server and client in a timezone-safe, deterministic way.

## Terminology

- Goal: A user’s commitment with a verification method and a time window when verification must happen.
- Verification method: How the user proves completion: photo, checkin, movement, (location – TBD).
- Window: The period during which user action is valid for an occurrence.
- Occurrence: For recurring goals, a specific local calendar date instance of the goal (e.g., Tuesday’s occurrence).
- Due start/end:
  - dueStartTime: When the verification window opens.
  - dueEndTime: When the verification window closes (optional for some methods).
- Grace: A short window after dueStartTime when a one-shot action can still be taken if dueEndTime is null.
- Duration: For duration-based methods (movement), the length of time that must elapse without violation.

## Time model and timezone

- All timestamps are stored in UTC.
- The engine computes in the user’s IANA timezone to respect local wall-clock semantics and DST.
- Conversions:
  - For single goals: dueStartTime and dueEndTime are absolute UTC instants.
  - For recurring goals: windows are derived from local time-of-day and local dates, then converted to UTC instants per occurrence.
- DST handling: All comparisons are done on instants; boundaries are computed from local wall time -> instant per the user’s timezone.

## States (per occurrence)

- scheduled: Before the window opens.
- window_open: Window is open and user can perform the required action.
- ongoing: A duration-based action (movement) is in progress.
- awaiting_verification: Optional state if a verification requires review (e.g., photo approval). Otherwise, successful actions go straight to passed.
- passed: The occurrence succeeded within the rules.
- missed: The window closed without a successful action.
- failed: Business decision to penalize a missed occurrence (often immediately after missed, or at a configured time such as end-of-day).
- expired: Overall goal bound is past for single goals without resolution.

Notes:

- The server is authoritative for final passed/failed states. The engine provides expected state and next transitions.
- For recurring goals, each date’s occurrence has its own state lifecycle.

## Method rules

### Photo (duration = null)

- Action: User submits a photo via the app. A log entry is created with timestamps, and optionally a review step.
- Windows:
  - No dueEndTime: window = [dueStartTime, dueStartTime + graceTimeSeconds].
  - With dueEndTime: window = [dueStartTime, dueEndTime].
- State transitions:
  - Before window: scheduled.
  - In window: window_open. If photo submitted in window:
    - If review not required: passed.
    - If review required: awaiting_verification → approved: passed; rejected: missed (if window still open, user may resubmit).
  - After window: If no valid submission, missed → may become failed per policy.
- UI flags:
  - No dueEndTime: showCheckinModal during grace window; no persistent button.
  - With dueEndTime: showCheckinButton while window_open.

### Checkin (duration = null)

- Action: User taps to check in. A log entry records the instant.
- Windows:
  - No dueEndTime: window = [dueStartTime, dueStartTime + graceTimeSeconds].
  - With dueEndTime: window = [dueStartTime, dueEndTime].
- State transitions:
  - Same as photo (but typically no review phase): check-in within window → passed; otherwise missed.
- UI flags:
  - No dueEndTime: showCheckinModal during grace window.
  - With dueEndTime: showCheckinButton while window_open.

### Movement (duration > 0)

- Action: The user must remain still (no motion) for the required duration. This can operate in two modes depending on dueEndTime.
- Windows:
  - No dueEndTime: Required no-motion interval is [dueStartTime, dueStartTime + duration].
  - With dueEndTime: Window = [dueStartTime, dueEndTime]. The user must start a timer within the latest allowable start window.
- Key definitions:
  - latestStart = dueEndTime - duration (only when dueEndTime exists).
- State transitions:
  - No dueEndTime:
    - At dueStartTime, monitoring begins; any motion during [dueStartTime, dueStartTime + duration] → failed immediately.
    - No motion for the entire interval → passed at dueStartTime + duration.
  - With dueEndTime:
    - Before dueStartTime: scheduled.
    - In [dueStartTime, latestStart]: window_open; show timer CTA.
    - On timer start: ongoing until startedAt + duration.
    - Motion while ongoing: failed immediately; timer is cancelled.
    - No timer start by latestStart: missed.
    - Timer completes without motion: passed at startedAt + duration.
    - After dueEndTime (if neither passed nor failed): missed.
- UI flags:
- showTimer: true during [dueStartTime, latestStart] (only when dueEndTime exists).

### Location (TBD)

- Not yet defined; expected to mirror movement with a geofence rule (stay within/enter within window). Placeholder for future rules.

## Recurring goals

- A goal can specify a weekly recurrence with selected weekdays within [startDate, endDate]. Each selected local day creates an occurrence.
- For an occurrence on local date D:
  - Compute local window using D and local time-of-day (e.g., 07:00–08:00), then convert to UTC instants.
  - Apply the same method rules as above per occurrence.
- State isolation: Each day’s occurrence state is independent (passed/missed/failed per day).

### Occurrence generation

- Inputs: user timezone, recurrence daysOfWeek, startDate, endDate, local time-of-day for window start/end (or duration/grace).
- For a given evaluation horizon (e.g., today/next few days), generate occurrences and their corresponding UTC windows.
- For the client: usually only today’s occurrence (and possibly the next upcoming) is needed.
- For the server: compute nextTransitionAt across all active occurrences to schedule jobs.

## Outputs (from engine)

For an evaluated goal or occurrence, the engine provides:

- state: scheduled | window_open | ongoing | awaiting_verification | missed | failed | passed | expired
- flags:
  - showTimer: movement with end; while dueStartTime ≤ now ≤ latestStart.
  - showCheckinModal: checkin/photo without end; while dueStartTime ≤ now ≤ dueStartTime + grace.
  - showCheckinButton: checkin/photo with end; while dueStartTime ≤ now ≤ dueEndTime.
  - isDurationBased: durationSeconds > 0.
- windows:
  - currentWindow: { kind: "photo" | "checkin" | "movement" | "location", start: Instant, end?: Instant }
  - latestStart?: Instant (movement with end)
  - graceUntil?: Instant (photo/checkin without end)
- labels:
  - timeLeft: human-readable string (e.g., "2h left").
  - nextMilestone: until_start | until_window | until_latest_start | until_due_end | none
- nextTransitionAt: The exact instant when the state or flags will change next.
- engineVersion: A string to version the rules.

## Server behavior

- Authoritative state: The server writes final passed/failed to the database based on logs and windows.
- Scheduling:
  - On goal create/update, compute nextTransitionAt and enqueue a job.
  - At job time:
    - Recompute; if window just opened, schedule follow-ups for latestStart, dueEndTime, or graceUntil.
    - If occurrence transitioned to missed, apply failure policy (immediate or deferred to a configured cutoff such as local midnight).
  - Idempotency: Jobs must be safe to re-run; always recompute current state and check DB state before updating.
- Movement specifics:
  - A timer row records startedAt; completion is scheduled at startedAt + duration.
  - Motion events can immediately mark the occurrence failed.
- Recurring specifics:
  - Jobs should carry (goalId, occurrenceDate in local calendar) when possible to disambiguate.

## Client behavior

- Use engine to compute per-goal (or per-occurrence) state locally with the user’s timezone.
- Use nextTransitionAt for precise local recomputation (setTimeout at boundary), avoiding polling.
- Map flags to UI elements:
  - showTimer → show start timer CTA.
  - showCheckinModal → show ephemeral modal during grace.
  - showCheckinButton → show persistent button during window.

## Edge cases and notes

- Missing fields:
  - If dueStartTime is missing: treat as no deadline and do not open any windows.
  - If durationSeconds ≤ 0 for movement: treat as non-duration; do not show timer.
- DST transitions:
  - Occurrence slots must use local wall time; when a day has a 23h/25h length, windows may shift in UTC but remain consistent in local time.
- Conflicts:
  - If both a successful log and a violation occur, the earliest decisive event in the window wins (e.g., motion during ongoing → failed even if a completion log is later generated).
- Review steps (photo):
  - If review is enabled, state can go through awaiting_verification; otherwise immediate pass on submission.

## Reference formulas

- latestStart = dueEndTime - duration (movement with dueEndTime).
- graceUntil = dueStartTime + graceTimeSeconds (photo/checkin without dueEndTime).
- showTimer = dueStartTime ≤ now ≤ latestStart (movement with end and duration > 0).
- showCheckinModal = dueStartTime ≤ now ≤ graceUntil (no dueEndTime).
- showCheckinButton = dueStartTime ≤ now ≤ dueEndTime (with dueEndTime).

## Minimal data needed

- goal: id, startDate, endDate?, dueStartTime, dueEndTime?
- verificationMethod: method (photo | checkin | movement | location), durationSeconds?, graceTimeSeconds?
- user timezone (IANA)
- For recurring goals: recurrence definition (e.g., daysOfWeek) and local time-of-day for start/end (or derive the UTC instants per occurrence on the server).

## Examples

1. Checkin without dueEndTime, grace 60s:

- Window: [08:00, 08:01] local → check-in during this minute → passed; otherwise missed.

2. Photo with dueEndTime 08:30:

- Window: [08:00, 08:30] local → submit photo any time in window → passed.

3. Movement with dueEndTime 08:30 and duration 10m:

- latestStart: 08:20 local.
- User can start timer between 08:00–08:20. On start, ongoing; move → failed; no move → passed at startedAt+10m. No start → missed at 08:20; overall window ends 08:30.

4. Movement without dueEndTime and duration 10m:

- Required no-motion interval is [08:00, 08:10] local; motion → failed; no motion → passed at 08:10.

## Versioning

- This document corresponds to engineVersion: v1.
- Any future behavioral change must increment engineVersion and be documented here.
