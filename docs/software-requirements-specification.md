# Software Requirements Specification

## Introduction

- **Purpose**:
  - Primary users: Private adult individuals who want to take action in their
    lives and seek stronger follow-through on commitments.
  - Core problem: Providing extra motivation to get things done by introducing a
    financial stake and social accountability.
  - Top objectives:
    1. Increase goal adherence by letting users stake money against personal
       goals.
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
- Verification methods: Phone GPS, device time, and photo evidence.
- Money flow: Real money via Stripe (payments and transfers).
- Group challenges: Invite-only, private groups.
- Out of scope (MVP): App Store/Play Store deployment, tablet support, advanced
  analytics.
- Languages: English only at launch.
- Accessibility & compliance: Out of scope for MVP.
- **Definitions & Acronyms**:
- **References**:

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
  - Timeline: MVP and first public beta targeted in 3 weeks.
- **Functional Requirements**:
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

### Core Features

- [Feature 1]: Description
- [Feature 2]: Description
- [Feature 3]: Description

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
