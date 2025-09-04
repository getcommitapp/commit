# @commit/engine

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#api">API</a></li>
    <li><a href="#goal-states">Goal States</a></li>
    <li><a href="#verification-methods">Verification Methods</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

The `@commit/engine` package is a pure, timezone-aware goal state engine that provides deterministic, stateless functions for computing goal states. It's currently used only on the server side to determine goal status, available actions, and transition timing.

Key highlights:

- **Pure functions**: No side effects, same input always produces same output
- **Timezone-aware**: Handles local time calculations and recurring goals
- **Multiple verification methods**: Checkin, photo, movement, and location-based goals
- **State management**: Computes current goal state, available actions, and next transitions
- **Recurring goals**: Supports weekly recurring goals with specific day selections

## Prerequisites

- `Node.js 22+`
- `pnpm` (workspace root manages dependencies)

## Getting Started

Install dependencies and build the engine from the workspace root:

```sh
pnpm -w install
pnpm -w build
```

The engine is automatically built as part of the workspace build process and can be imported by other packages.

## API

### Main Function

```ts
import { computeGoalState } from "@commit/engine";

const result = computeGoalState({
  goal: goalData,
  tz: "Europe/Zurich",
  now: new Date(),
  occurrenceVerification: { status: "pending" },
  occurrenceContext: { timerStartedAt: new Date() },
});
```

### Core Types

```ts
import type {
  GoalCore,
  EngineInputs,
  EngineOutputs,
  GoalState,
  VerificationMethod,
} from "@commit/engine";
```

## Goal States

The engine computes one of these states for any given goal:

| State                   | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `scheduled`             | Goal is scheduled for a future time, not yet actionable              |
| `window_open`           | Goal verification window is currently open and actions are available |
| `ongoing`               | Goal is in progress (e.g., movement timer is running)                |
| `awaiting_verification` | Verification has been submitted and is pending review                |
| `passed`                | Goal was successfully completed and verified                         |
| `missed`                | Goal verification window has passed without completion               |
| `failed`                | Goal verification was explicitly rejected                            |
| `expired`               | Goal has expired and is no longer actionable                         |

## Verification Methods

The engine supports different verification methods, each with specific rules:

### Checkin

- Simple check-in during a time window
- Configurable grace period for goals without end times
- Modal presentation during grace, button during fixed windows

### Photo

- Photo upload verification during time window
- Configurable grace period for goals without end times
- Same presentation logic as checkin

### Movement

- Duration-based verification (e.g., "stay still for 20 minutes")
- Timer management with start/stop capabilities
- Latest start time calculation for goals with end times

### Location

- Location-based verification (placeholder implementation)
- Basic time window management
- Future: radius, coordinates, and location validation

## Scripts

You can run these commands from `packages/engine`:

```sh
# Build the package
pnpm build

# Clean build artifacts
pnpm clean

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

> [!TIP]
> The engine is typically built from the workspace root using `pnpm -w build`

## Project Structure

```
packages/engine/
├─ src/
│  ├─ rules/               # Verification method implementations
│  │  ├─ checkin.ts        # Checkin verification logic
│  │  ├─ photo.ts          # Photo verification logic
│  │  ├─ movement.ts       # Movement verification logic
│  │  ├─ location.ts       # Location verification logic
│  │  └─ common.ts         # Shared utility functions
│  ├─ types.ts             # Core type definitions
│  ├─ occurrence.ts        # Occurrence calculation logic
│  ├─ tz.ts               # Timezone utilities
│  ├─ clock.ts            # Clock abstraction interface
│  ├─ public.ts           # Main public API
│  └─ index.ts            # Package exports
├─ tests/                  # Test suite
│  ├─ checkin.test.ts     # Checkin method tests
│  ├─ photo.test.ts       # Photo method tests
│  ├─ movement.test.ts    # Movement method tests
│  ├─ location.test.ts    # Location method tests
│  ├─ recurring.test.ts   # Recurring goal tests
│  └─ computeGoalState.test.ts # Integration tests
├─ dist/                   # Built output (generated)
├─ package.json            # Package configuration
├─ tsconfig.json          # TypeScript configuration
└─ README.md              # This file
```

> [!NOTE]
> The engine is currently only used on the server side. Client-side integration may be added in the future for offline state computation.
