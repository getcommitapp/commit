# Software Requirements Specification

## Introduction

- **Purpose**:
  - Primary users: Private adult individuals who want to take action in their
    lives and seek stronger follow-through on commitments.
  - Core problem: Providing extra motivation to get things done by introducing a
    financial stake and social accountability.
  - Top objectives:
    1. Increase goal adherence by letting users stake money against personal
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
- User types: Standard users only (no admin/moderator roles for MVP).
- MVP goal types: Wake-up time, location-based, time-based, duration-based, and
  combinations of location/time/duration.
- Money flow: Real money via Stripe (payments and transfers).
- Group challenges: Invite-only, private groups.
- Out of scope (MVP): App Store/Play Store deployment, tablet support, advanced
  analytics.
- Languages: English only at launch.
- Accessibility & compliance: Out of scope for MVP.
- **Definitions & Acronyms**:

## Project Description

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
- **Non-Functional Requirements**:

## System Overview

- High-level description of the app
  - Solo flow: A user creates a goal, configures recurrence or due date, selects
    a verification method (GPS/time/photo), sets a stake amount and a
    destination for funds. If the goal is completed and verified within the
    rules, no transfer occurs; if not, the staked amount is transferred to the
    configured destination.
  - Group flow: A user creates a private, invite-only group challenge with a
    defined goal and stake amount (and a fallback destination if all
    participants fail). Invitees accept the stake. Upon completion, successful
    participants receive the pooled stakes from members who failed; if all fail,
    funds are sent to the fallback destination.
- Target platforms (iOS, Android, etc.)
- Mobile: iOS and Android (phones only; no tablet support)
- Permissions/capabilities: Background location (GPS), camera, push
  notifications, device usage detection (for no-phone-use goals)
- Expo: SDK and EAS details TBD
- Web: Single static marketing landing page (Astro + React)
- Target audience
  - Adults 18+ seeking productivity, fitness improvements, and habit-building.

## Functional Requirements

### User Management

- Users can register with email/social login
- Users can manage profiles
- Password reset functionality

#### Authentication

- Sign-in methods: Google, Apple (no email/password at MVP)
- Pre-stake verification: No email/phone verification required before staking
- KYC/identity checks: Not required at MVP for payouts via Stripe

#### Payments & Account Receivers (MVP decisions)

- Charging: Users are charged immediately when a stake is created. The platform collects funds in its Stripe account (acting as escrow) until the goal is resolved.
- Recipients:
  - Solo challenge: at creation the user selects a recipient among: (a) a named person (requires their payout details), (b) a charity from a small predefined list, or (c) the developers (platform donation account).
  - Group challenge: on resolution, winners split the stakes evenly among all winners. If no participants succeed, the pooled funds are transferred to the developers' platform account.
- Platform fees: No operational commission will be taken on stake transfers for the MVP; transfers to the developers' account are treated as donations.
- Payout timing: instant payouts to winners are preferred; this requires connected payout accounts for recipients or platform-managed routing via Stripe. The team will use Stripe Connect patterns appropriate to this choice in implementation.
- Refunds & disputes: there is an appeals process for contested failures; see "Appeals" below for policy.

### Core Features

- [Feature 1]: Description
- [Feature 2]: Description
- [Feature 3]: Description

### Verification & Goal Rules

- Verification methods supported in MVP: GPS (location), device time checks, and photo evidence.
- Photo verification: initially manual verification by the project team. If workload permits, manual verification is performed before final settlement of funds. AI-assisted verification is planned for a future iteration.
- Combined verification: goals may require multiple verification methods (for example, a hike may require both GPS route/arrival and a photo of the summit).
- GPS rules: behavior depends on goal type. Typical defaults (configurable per goal):
  - Arrival-type goals: radius default 50 meters and minimum dwell time 5 minutes (configurable per goal).
  - Step or route goals: dynamic location checks across the route.
- No-phone-use goals: included in MVP but the precise detection mechanism is TBD. Options include in-app foreground session monitoring, OS usage APIs, or photographic proof workflows.
- Offline/technical failures: there is no automatic fallback; users may file an appeal if verification cannot be performed due to technical reasons.

### Notifications

- Push notifications for events
- In-app notifications

### Settings

- Language preferences
- Privacy & security settings

## Non-Functional Requirements

### Performance

- App should load within 2 seconds
- Support at least 10,000 concurrent users

### Security

- Data encryption in transit and at rest
- Secure authentication (OAuth2, JWT, etc.)

### Reliability & Operations notes

- Manual verification SLA: initial target is to perform manual photo verifications within 24–48 hours of submission. The team will adjust this SLA based on capacity.
- Appeals SLA: appeals should be addressed within 48–72 hours.

### Usability

- Intuitive navigation
- Consistent UI across platforms

### Reliability & Availability

- 99.9% uptime
- Graceful error handling

### Compatibility

- Support iOS 14+ and Android 10+
- Responsive design for different screen sizes

### Maintainability

- Modular codebase following Clean Architecture
- Comprehensive documentation and unit tests

## Preliminary Architecture Description

- Presentation layer (UI/UX)
- Application layer (state management, controllers)
- Domain layer (business logic, use cases)
- Data layer (APIs, local DB, repositories)
- Infrastructure (networking, analytics, logging)

## Mockups / Landing Page

- Figma designs
- Paper sketches
- Landing page prototype

## Technical Choices

- Programming languages & frameworks
- Databases
- Third-party libraries & APIs
- Cloud services (if any)

## Work Process

- Version control strategy (e.g., Git Flow)
- DevOps practices
- Agile/Scrum/Kanban methodology

## Development Tools Setup

- Issue tracker (e.g., Jira, GitHub Issues)
- Code review tools
- Documentation tools

## Deployment Environment

- Target infrastructure (e.g., AWS, Azure, on-premise)
- Environment setup (staging, production)

## CI/CD Pipeline

- Continuous integration setup (tests, builds)
- Continuous delivery & deployment automation
- Monitoring & rollback strategy

## Constraints & Assumptions

- Budget & time constraints
- Third-party dependencies
- Regulatory compliance (e.g., GDPR)

## Appendices

- Glossary
- Mockups/Wireframes
- API reference (if applicable)

## Points to Refine Later

- Minimum OS versions for iOS and Android
- Expo SDK version and EAS build configuration
- Implementation/permission model for device usage detection (no-phone-use
  goals)
- Details on ensuring instant transfers with minimal fees via Stripe
