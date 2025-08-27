### Auth

Handled by BetterAuth.

### User

- GET `/user` – fetch own user
- PUT `/user` – update user
- POST `/user` – add Stripe/payment info
- DELETE `/user` – delete the account

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
