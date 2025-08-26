### Auth / Profile

- POST `/signup` – create account (from Google or Apple)
- GET `/profile` – fetch own profile
- PUT `/profile` – update profile
- POST `/profile/stripe` – add Stripe/payment info
- DELETE `/profile` – delete the account
- POST `/logout` – log out

---

### Goals

- GET `/goals` – list all goals (owned/joined)
- POST `/goals` – create a new goal
- GET `/goals/<id>` – fetch details of a goal
- DELETE `/goals/<id>` – delete a goal (owned)
- POST `/goals/<id>/verify` – verify completion of a goal

---

### Groups

- GET `/groups` – list all groups (joined)
- POST `/groups` – create a new group (invite link also created)
- GET `/groups/<id>` – fetch group details
- GET `/groups/<id>/invite` – get invite link
- GET `/groups/<id>/invite/verify` – verify invite link
- GET `/groups/<id>/goal` – see group goal
- POST `/goals/<id>/verify` – verify group goal completion  
  _(uses the same verify endpoint as individual goals)_
- POST `/groups/<id>/leave` – leave the group
