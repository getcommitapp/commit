# @commit/engine

Pure, timezone-aware goal state engine shared by server and client.

- Deterministic, stateless functions
- Supports single and recurring goals
- Method-specific rules: checkin, photo, movement, (location stub)
- Returns current state, UI flags, and nextTransitionAt for precise scheduling

## API

```ts
import { computeGoalState } from "@commit/engine";
```

## Development

- Build: `pnpm -w --filter @commit/engine build`
- Test: `pnpm -w --filter @commit/engine test`
