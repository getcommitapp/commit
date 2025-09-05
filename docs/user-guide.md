# User Guide

## Getting Started

1. **Open app**
2. **Authenticate with Google / Apple**
3. **Press `next` on the 4 onboarding screens**

Now you are in the home screen.

<img src="screenshots/shared image (18).jpg" width="300">

## Register Payment Method

4. **Press on the `Profile` tab**
5. **Under `Payment`, press on `Method`** and enter the card number `4242 4242 4242 4242`, a valid expiration date and a random CVC.

<img src="screenshots/shared image (4).jpg" width="300">

## Creating a Goal

6. **Press on `New Goal`**
7. **Choose a goal template or a custom goal**

### Goal Templates

There are two pre-configured goal templates available:

- **Wake Up Goal**: Uses check-in verification to prove you wake up at a specific time. You'll tap a button to confirm you're awake during your verification window.
- **No-Phone Goal**: Uses movement verification to ensure you don't use your phone for a set duration. The app monitors motion sensors to detect if you're inappropriately moving the device when you should be avoiding it.

<img src="screenshots/shared image (1).jpg" width="300">

### Custom Goal Verification Methods

8. **If you chose a custom goal**, select one of these three verification methods:

- **Photo Validation**: Take a selfie or scene photo as proof at the due time. Photos are reviewed by trained reviewers for validation.
- **Check-In**: Confirm completion by tapping a button at the right time. Simple time-based verification.
- **Phone Movement**: Use motion sensors to verify activity (e.g., walk or run). The phone detects movement patterns to confirm you're being active during the specified period.

<img src="screenshots/shared image (7).jpg" width="300">

9. **Fill in the goal details** (some are optional) and press `Create Goal`

<img src="screenshots/shared image (16).jpg" width="300">

## Creating a Group

10. **Press on `New Group`**
11. **Enter the group name and description** and press `Next`
12. **Create the goal** like shown previously and press `Create Group`

<img src="screenshots/shared image (8).jpg" width="300">

## Joining a Group

13. **Press on `Join Group` in the homepage, or `Join` in the Groups page**
14. **Enter the group code** and press `Join`

<img src="screenshots/shared image (20).jpg" width="300">

## View Goals & Groups

15. **Press on the `Goals` tab**

<img src="screenshots/shared image (11).jpg" width="300">

16. **Press on the `Groups` tab**

<img src="screenshots/shared image (12).jpg" width="300">

17. **Press on a group or goal** to view its details

<img src="screenshots/shared image (13).jpg" width="300">

## Verifying a Goal

18. **On the Home or Goals page**, press on the goal to verify it. You can only verify it if it is in its verification window.

**Goal Status**: Your goals will show their current status such as `Scheduled`, `Window open`, `Ongoing`, `Awaiting verification`, `Passed`, `Failed`, or `Missed`.

### Verification Methods Explained

The verification process depends on your goal's method:

#### Check-In Verification

- **When no end time is set**: A popup modal appears during your grace period (default 60 seconds after due time). Simply tap `Check-in` to confirm completion.
- **When an end time is set**: A `Check-in` button is available throughout your verification window. Tap it anytime within the window to verify.

#### Photo Verification

- **When no end time is set**: A `Submit Photo` button appears during your grace period for quick photo upload.
- **When an end time is set**: A `Submit Photo` button is available throughout your verification window. Photos are reviewed by trained staff for approval.

#### Movement Verification

This method works differently depending on whether your goal has an end time:

- **When no end time is set**: The app automatically monitors motion sensors during your goal's duration period (e.g., for a `No-Phone Goal`). No buttons are shown - monitoring begins automatically when your goal becomes active.
- **When an end time is set**: A `Start timer` button appears, allowing you to manually begin the monitoring period within your verification window.
- While a movement timer is active, the goal will display a countdown timer showing the remaining time (e.g., `Timer: 2:35`).
- The app detects motion violations and automatically fails your goal if inappropriate movement is detected during the monitoring period.

## Deleting a Goal

19. **On the Goals page**, press on the goal to delete it. You can only delete it if it is in a finished state: **Failed**, **Missed**, or **Passed**. You cannot delete a goal linked to a group.

## Deleting a Group

20. **On the Groups page**, press on the group to delete it. You can only delete it if the goal linked to it is in a finished state: **Failed**, **Missed**, or **Passed**.

<img src="screenshots/shared image (15).jpg" width="300">
