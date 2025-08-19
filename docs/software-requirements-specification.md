---
documentclass: article
classoption: titlepage
papersize: a4
fontsize: 11pt
geometry: margin=1in
numbersections: true
title: |
  \begin{center}
  \begin{minipage}{0.125\textwidth}
    \centering
    \includegraphics[height=50pt]{assets/commit-logo.png}
  \end{minipage}
  \hspace{0.5em}
  \begin{minipage}{0.125\textwidth}
    \centering
    \includegraphics[height=40pt]{assets/heig-vd-logo.png}
  \end{minipage}

  \vspace{1.5em}

  {\LARGE \textbf{Software Requirements Specification}}
  \end{center}
subtitle: |
  \textbf{commit.}\linebreak
  PDG - HEIG-VD
author:
  - Leonard Cseres
  - Tristan Gerber
  - Aladin Iseni
  - David Schildböck
date: \today
subject: "PDG"
header-includes:
  - \usepackage{graphicx}
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
  - \fancyhf{}
  - \fancyhead[L]{Software Requirements Specification}
  - \fancyhead[R]{commit.}
  - \fancyfoot[C]{\thepage}
  - \usepackage{setspace}
  - \onehalfspacing
  - \usepackage{enumitem}
toc: true
---

\pagebreak

# Introduction

- **Purpose**:
  - Primary users: Private adult individuals who want to take action in their
    lives and seek stronger follow-through on commitments.
  - Core problem: Providing extra motivation to get things done by introducing a
    financial stake and social accountability.
  - Top objectives:
    1. Increase goal adherence by letting users stake money
    2. Enable social accountability via groups and shared challenges with pooled
       stakes.
    3. Provide automated financial consequences when goals are missed.
  - Success metrics:
    - App Store/Play Store rating above 4.0 stars.
    - Weekly active users (WAU) growth.
    - Total amount of money staked/processed in the app.
- **Scope**:
- Platforms: iOS and Android via Expo; web landing page (marketing/information
  only).
- Geography at launch: Switzerland.
- User types: Standard users, reviewer and admin.
- MVP goal types: Wake-up time, location-based, time-based, duration-based, and
  combinations of location/time/duration.
- Money flow: Real money via Stripe (payments and transfers).
- Group challenges: Invite-only, private groups.
- Out of scope (MVP): App Store/Play Store deployment, tablet support, advanced
  analytics, notifications (not planned), appeals/dispute handling.
- Languages: English only at launch.
- Accessibility & compliance: Out of scope for MVP.

# Project Description

- **Objective**:
  - Product vision: Commit turns intentions into actions by combining simple
    goal tracking with real financial stakes and social accountability.
  - Primary use cases:
    1. Daily wake-up challenge at a set time
    2. Location-based workout (arrive and stay at a gym/park)
    3. Focused study session for a specified duration
  - Differentiators: Ease of use, pooled stakes for group challenges.
  - Constraints/guiding principles: Instant money transfers between parties with
    minimal fees.

# System Overview

- High-level description of the app
  - Solo flow: A user creates a goal, due date or recurrence, selects
    a verification method (GPS/time/photo), sets a stake amount and a
    destination for funds. If the goal is completed and verified within the
    rules, no transfer occurs; if not, the staked amount is transferred to the
    configured destination.
  - Group flow: A user creates a private, invite-only group challenge with a
    defined goal, due date or recurrence, selects a verification method (GPS/time/photo) and stake amount (and a fallback destination if all participants fail). Invitees accept the stake. Upon completion, successful participants receive the pooled stakes from members who failed; if all fail,
    funds are sent to the fallback destination.
- Mobile: iOS and Android (phones only; no tablet support)
- Permissions/capabilities: Background location (GPS), camera, device usage
  detection (for no-phone-use goals)
- Expo: SDK and EAS details TBD
- Web: Single static marketing landing page (Astro + React)
- Target audience
  - Adults 18+ seeking productivity, fitness improvements, and habit-building.

# Functional Requirements

## Reviewer and Admin Roles

- **Reviewer:**
  - Has all the capabilities of a standard user.
  - Can access and review user-submitted pictures for goal verification.
  - Can approve or reject verification evidence as part of the manual review process.

- **Admin:**
  - Role exists in the system but currently has no special functions defined for MVP.
  - Future admin capabilities will be specified as the project evolves.

## User Management

- Users can register with email/social login
- Users can manage profiles

### Authentication

- Sign-in methods: Google, Apple (no email/password at MVP)
- Pre-stake verification: No email/phone verification required before staking
- KYC/identity checks: Not required at MVP for payouts via Stripe

### Payments & Account Receivers (MVP decisions)

- Charging model: Stakes are defined at creation but only
  deducted if the goal is not achieved (on failure). If the goal is achieved, no
  funds are captured.
- Stake range: CHF 1 (min) to CHF 1000 (max) per goal.
- Currency: CHF only at launch.
- Recipients:
  - Solo challenge: at creation the user selects a recipient among: (a) a named
    person who is an existing app user, (b) a charity from a small predefined
    list, or (c) the developers (platform donation account).
  - Group challenge: on resolution, winners split the stakes evenly among all
    winners. If no participants succeed, the pooled funds go to the destination
    configured by the creator for the group goal.
- Platform fees: No operational commission will be taken on stake transfers for
  the MVP; transfers to the developers' account are treated as donations. Stripe
  processing fees are available [here](https://stripe.com/fr-ch/pricing/local-payment-methods).
- Payout timing: instant payouts to winners are preferred; this requires
  connected payout accounts for recipients or platform-managed routing via
  Stripe. The team will use Stripe Connect patterns appropriate to this choice
  in implementation.

## Core Features

- Goal lifecycle: create, edit, delete, view history
- Group lifecycle: create private group, invite by link, join/leave, view
  results
- Verification capture: GPS check, time check, in-app photo capture within
  window
- Money: create stake authorization, capture on failure, distribute to winners
  or fallback destination
- Activity/history: per-user list of past goals/challenges with outcomes
- Settings: change display name and profile photo

## Goal Creation

- Required fields: title/name, description, goal type
  (wake-up/location/time/duration/combined), start date, and due date or
  schedule/recurrence.
- Recurrence: select days of the week with an end date.
- Verification window: allowed; default ±10 minutes around the scheduled time
  (configurable per goal).
- Location goals: geofence with default and maximum radius (meters) and a
  must-stay duration — default radius 50 meters (maximum 500 meters) and minimum
  dwell time 5 minutes.
- Duration/focus goals: strictly continuous session; minimum and maximum
  duration values: default minimum 15 minutes, maximum 240 minutes (4 hours).
- Photo verification: photo must be captured within the verification window;
  front or back camera allowed; selfie not required.
- Failure definition: missing verification or verification outside the allowed
  window results in automatic failure.
- Grace/retries: none for MVP.

## Verification & Goal Rules

- Verification methods supported in MVP: GPS (location), device time checks, and
  photo evidence.
- Photo verification: captured within the verification window; front/back camera
  allowed; initially verified manually by the project team before final
  settlement of funds. AI-assisted verification is planned for a future
  iteration.
- Combined verification: goals may require multiple verification methods (for
  example, a hike may require both GPS route/arrival and a photo of the summit).
- GPS rules: behavior depends on goal type. Default geofence radius 50 meters
  (maximum 500 meters) and minimum dwell time 5 minutes; parameters are
  configurable per goal.
- No-phone-use goals: included in MVP but the precise detection mechanism is
  TBD. Options include in-app foreground session monitoring, OS usage APIs, or
  photographic proof workflows.
- Time windows: default ±10 minutes around scheduled time; configurable per
  goal.
- Failure handling: automatic failure if verification is missing or outside the
  allowed window.
- Grace/retries: no additional grace period or retries for MVP.
- Offline/technical failures: there is no automatic fallback; users may file an
  appeal if verification cannot be performed due to technical reasons.

## Group Challenges

- Size limit: up to 100 participants per group challenge.
- Stake uniformity: same stake amount for all participants.
- Join flow: invite via link with expiration; joiners must register/sign in and
  have a valid payment method on file.
- Invite expiration: default 7 days.
- Schedule: group goals follow the creator’s schedule. The creator may set a
  time interval window to allow flexibility for participants to perform within
  their availability.
- Distribution: on resolution, winners split the pooled stakes evenly. If no
  participants succeed, funds go to the destination selected by the creator for
  this group goal.
- Failure to verify: not providing required verification within the window is an
  automatic failure.
- Cancellation: if the creator cancels before the start, no stakes are captured
  (since capture happens only on failure at resolution).

## Settings

- Update display name

## Optional Functions (Future Enhancements)

- **Community Challenges:** Public or open group challenges where any user can join and compete, with shared stakes and leaderboards.
- **AI Image Check:** Automated verification of user-submitted photos using AI to reduce manual reviewer workload and improve scalability.
- **Additional Payment Methods:** Support for more payment options beyond TWINT, such as PayPal or credit cards.

# Non-Functional Requirements

## Performance

- App should load within 5 seconds
- Support at least 1000 concurrent users
- Backend latency targets (p95 within CH/EU): <= 500 ms

## Security

- Data encryption in transit and at rest
- Secure authentication (OAuth2, JWT, etc.)
- Stored data: user profile, account, groups, goals, integrations. Avoid storing
  unnecessary sensitive data.
- Photo storage: stored as objects in Supabase Storage (S3-compatible).
  Retention policy: Out of scope for MVP.
- Location data: not stored server-side; processed on-device for verification
  where possible.
- Access control: goals are private by default; group members only see minimal
  status (success/failure) and not each other's raw verification artifacts.

## Privacy

- Photos are stored for verification purposes only; access is restricted to the
  account owner and authorized reviewers.
- Location traces are not persisted server-side; only ephemeral checks are
  performed for verification.
- Compliance posture: out of scope for MVP.

## Reliability & Operations notes

- Manual verification SLA: initial target is to perform manual photo
  verifications within 24–48 hours of submission. The team will adjust this SLA
  based on capacity.

## Usability

- Intuitive navigation
- Consistent UI across platforms

## Reliability & Availability

- 99.9% uptime
- Graceful error handling

## Compatibility

- Support iOS 14+ and Android 10+
- Responsive design for different screen sizes

## Maintainability

## Battery & Location Usage

- Use region/geofence monitoring only; avoid continuous GPS tracking

## Offline Behavior

- Online-only MVP: goal creation and verification require connectivity
- Modular codebase following Clean Architecture
- Comprehensive documentation and unit tests

# Preliminary Architecture Description

- Presentation layer: React native
- Application layer: React native + Supabase 
- Data layer: Supabase + PostgreSQL
- Infrastructure: Supabase hosting

# Mockups / Landing Page

- Figma designs
- Paper sketches
- Landing page prototype

# Technical Choices

- Programming languages & frameworks: Expo + React Native (TypeScript)
- Database: Postgres (Supabase)
- Backend/services: Supabase (Auth, DB, storage, edge functions)
- Payments: Stripe Connect Standard with TWINT enabled for Switzerland
- Third-party libraries & APIs: Stripe SDK, Expo Location/Camera
- Hosting: Supabase (backend, DB, auth); Cloudflare Pages (Astro + React landing
  page)

# Work Process

## Agile Methodology: SCRUM

- **Team roles:** Roles (Product Owner, Scrum Master, Developers) are rotating among team members throughout the project.
- **Sprint length:** Each sprint lasts 3 days, reflecting the short 3-week project timeline.
- **Ceremonies:** The team holds a daily standup and a sprint review at the end of each sprint. Other SCRUM ceremonies (planning, retrospective) are adapted or combined as needed.
- **Backlog management:** All tasks and user stories are tracked as GitHub Issues, organized and prioritized in a GitHub Project Kanban board.
- **Definition of Done:** A task is considered done when the code is merged, all tests pass, and the feature works as intended.
- **Sprint goal:** Each sprint has a defined goal or deliverable to be implemented.
- **Estimation:** Tasks are estimated in terms of expected time to complete.
- **Review and acceptance:** The team collectively reviews and accepts completed work at the end of each sprint.
- **Adaptations:** Roles may be combined and ceremonies adapted based on project advancement and team needs, in line with the university context.
- **Process**: lightweight Kanban for MVP

## Git Flow

- The `main` branch contains production code.
- Every upgrade is discussed via an issue and a branch is created with the issue.
- All changes are integrated via pull requests with code review and CI checks

## Devops
- Continuous delivery to production when changes pass CI and review

# Development Tools Setup

- Issue tracker: GitHub Issues
- Code review: GitHub pull requests
- Documentation: repository README and SRS in docs/
- Code style: Prettier + ESLint with TypeScript rules
- State/data libraries: TBD (e.g., Zustand, React Query)
- Testing approach: TBD (at minimum unit tests for core logic; consider 1 e2e
  flow with Detox)
- Secrets/config: Supabase and Stripe keys via env files with secure storage

# Deployment Environment

- Backend and data: Supabase project (Auth, Postgres, Storage, Edge Functions),
  EU region (eu-central-1).
- Web landing page: Cloudflare Pages (static hosting with global CDN).
- Mobile app: Expo EAS builds with two channels: development and production. App
  Store/Play Store distribution is out of scope for MVP; internal distribution
  only (TestFlight/Android internal testing).
- Environments: development and production only, with separate Supabase projects
  and isolated resources.
- Secrets/configuration: managed via Supabase project settings, Cloudflare Pages
  environment variables, and EAS secrets. Stripe runs in Test mode for
  development and Live mode for production.

# CI/CD Pipeline

- CI on PRs: lint, typecheck, build, and tests
- CD: auto-deploy to development on main merges; promote to production on tagged
  releases
- Monitoring & rollback: basic health checks; manual rollback by reverting
  deploy

# Constraints & Assumptions

- Budget & time constraints: 70K CHF budget; 3-week MVP timeline
- Regulatory compliance: out of scope for MVP

# Points to Refine Later

- Minimum OS versions for iOS and Android
- Expo SDK version and EAS build configuration
- Implementation/permission model for device usage detection (no-phone-use
  goals)
- Details on ensuring instant transfers with minimal fees via Stripe
- Stripe fee responsibility (payer model)
- Initial charity list for solo goal destinations

```{=latex}
\pagebreak
\appendix
```

# Appendix

## Glossary

```{=latex}
\begin{description}[style=nextline,labelwidth=4cm,leftmargin=5cm]
\item[\textbf{Stake}] The amount of money a user commits that may be captured if the goal is not achieved.
\item[\textbf{Capture}] Charging the authorized stake when a goal is marked as failed.
\item[\textbf{Goal window}] The scheduled time period during which the user must complete and verify the goal.
\item[\textbf{Verification window}] The allowed buffer around the scheduled time for submitting verification (default ±10 minutes).
\item[\textbf{Geofence}] A virtual radius around a location used to verify presence (default 50 m; max 500 m).
\item[\textbf{Dwell time}] The minimum time a user must remain inside a geofence (default 5 minutes).
\item[\textbf{Destination}] The recipient configured to receive funds when a goal fails (person, charity, or platform donation).
\item[\textbf{Winner pool}] The set of participants in a group challenge who achieved the goal and split the captured stakes.
\item[\textbf{Group challenge}] A private, invite-only challenge with a uniform stake and shared rules created by a user.
\end{description}
```

## Mockups

TBD
