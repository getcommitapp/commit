### Auth

Handled by BetterAuth.

### User

- GET `/api/users` – fetch own user
- PUT `/api/users` – update user
- DELETE `/api/users` – delete the account

---

### Goals

- GET `/api/goals` – list all goals (owned/joined)
- POST `/api/goals` – create a new goal
- GET `/api/goals/<id>` – fetch details of a goal
- DELETE `/api/goals/<id>` – delete a goal (owned)
- POST `/api/goals/<id>/verify` – verify completion of a goal

---

### Groups

- GET `/api/groups` – list all groups (joined)
- POST `/api/groups` – create a new group (invite link also created)
- GET `/api/groups/<id>` – fetch group details
- GET `/groups/<id>/invite` – get invite link
- GET `/api/groups/<id>/invite/verify` – verify invite link
- GET `/api/groups/<id>/goal` – see group goal
- POST `/api/goals/<id>/verify` – verify group goal completion
  _(uses the same verify endpoint as individual goals)_
- POST `/api/groups/<id>/leave` – leave the group
