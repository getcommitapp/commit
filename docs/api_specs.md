### 🔑 Auth / Profile

- **POST** `/signup` – create account
- **GET** `/profile` – fetch own profile
- **PUT** `/profile/edit` – update profile
- **POST** `/profile/stripe` – add Stripe/payment info
- **POST** `/logout` – log out

---

### 🎯 Goals

- **GET** `/goals` – list all goals (owned/joined)
- **POST** `/goals/create` – create a new goal
- **GET** `/goals/<id>/details` – fetch details of a goal
- **DELETE** `/goals/<id>/delete` – delete a goal
- **POST** `/goals/<id>/verification` – verify completion of a goal

---

### 👥 Groups

- **GET** `/groups` – list all groups (joined)
- **POST** `/groups/create` – create a new group
- **GET** `/groups/<id>/details` – fetch group details
- **POST** `/groups/<id>/goal` – add/set a goal for the group
- **GET** `/groups/<id>/inviteLink` – get invite link
- **POST** `/groups/<id>/verification` – verify group goal completion
- **POST** `/groups/<id>/leave` – leave the group

---

### 📝 Forms

- **GET** `/forms` – list all forms
- **GET** `/forms/<id>` – fetch one form
