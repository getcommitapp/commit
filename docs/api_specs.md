### Auth / Profile

- POST `/signup` – create account (from Google or Apple)
- GET `/profile` – fetch own profile
- PUT `/profile/edit` – update profile
- POST `/profile/stripe` – add Stripe/payment info
- DELETE `/profile` - delete the account
- POST `/logout` – log out

---

### Goals

- GET `/goals` – list all goals (owned/joined)
- POST `/goals/create` – create a new goal
- GET `/goals/<id>/details` – fetch details of a goal
- DELETE `/goals/<id>/delete` – delete a goal (owned)
- POST `/goals/<id>/verification` – verify completion of a goal

---

### Groups

- GET `/groups` – list all groups (joined)
- POST `/groups/create` – create a new group (invite link also created)
- GET `/groups/<id>/details` – fetch group details
- GET `/groups/<id>/getInviteLink` – get invite link
- GET `/groups/<id>/verifyInviteLink` – verify invite link
- POST `/groups/<id>/goal` – see group goal
- POST `/groups/<id>/verification` – verify group goal completion
- POST `/groups/<id>/leave` – leave the group
