# The Commit protocol - RESTful API

## Section 1 - Overview

The Commit mobile app API allows clients (mobile apps) to manage accounts, goals, and groups. It is a RESTful API, where resources (users, goals, groups) are accessed via URLs, and actions are performed using HTTP methods (GET, POST, PUT, DELETE).

Clients must authenticate using a Bearer token (except `/signup`) for all requests. Responses are JSON-formatted, and standard HTTP status codes are used to indicate success or failure.

> [!NOTE]
> RESTful APIs are stateless: each request must include all authentication data.

## Section 2 - Transport Protocol

The API uses HTTPS as the transport protocol to ensure reliability and security. Requests and responses are JSON-formatted, UTF-8 encoded.

> [!NOTE]
> HTTPS is mandatory to protect sensitive information such as passwords and payment data.

> [!NOTE]
> All endpoints should respond with appropriate HTTP status codes:
>
> - `200 OK` - request succeeded
> - `201 Created` - resource created
> - `400 Bad Request` - invalid request
> - `401 Unauthorized` - authentication failed
> - `404 Not Found` - resource does not exist
> - `413 Payload Too Large` - data sent too large
> - `500 Internal Server Error` - server error

## Section 3 - Messages / Requests

### Auth / Profile

#### Create Account (Signup)

Request:

```txt
POST /signup
Content-Type: application/json

{
  "method": "google|apple",
  "token": "<oauth_token>"
}
```

Response:

```txt
{
  "id": "<user_id>"
}
```

---

#### Get Profile

Request:

```txt
GET /profile
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<user_id>",
  "username": "<username>",
  "display_name": "<display_name>",
  "email": "<email>",
  "stripe_status": active|descative
}
```

---

#### Update Profile

Request:

```txt
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "<current_username>",
  "display_name": "<new_display_name>",
  "email": "<current_email>"
}
```

Response:

```txt
{
  "message": "Profile updated successfully."
}
```

---

#### Add Stripe Info

Request:

```txt
POST /profile/stripe
Authorization: Bearer <token>
Content-Type: application/json

{
  "stripe_customer_id": "<stripe_id>"
}
```

Response:

```txt
{
  "message": "Stripe account linked successfully."
}
```

---

#### Delete Account

Request:

```txt
DELETE /profile
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Account deleted successfully."
}
```

---

#### Logout

Request:

```txt
POST /logout
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Logged out successfully."
}
```

### Goals

#### List Goals

Request:

```txt
GET /goals
Authorization: Bearer <token>
```

Response:

```txt
[
  {
    "id": "<goal_id>",
    "title": "<goal_title>",
    "stake": "<goal_stake>",
    "deadline_rrule": "<goal_deadline_rrule>",
    "group_name": "<group_name>"
  }
]
```

---

#### Get Goal Details

Request:

```txt
GET /goals/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<goal_id>",
  "title": "<goal_title>",
  "stake": "<goal_stake>",
  "deadline_rrule": "<goal_deadline_rrule>",
  "group_name": "<goal_group_name>",
  "start_date": "<goal_start_date>",
  "end_date": "<goal_end_date>",
  "beneficiary": "<goal_beneficiary>",
  "description": "<goal_description>",
  "verification_window": "<goal_verification_window>",
  "status": "upcoming|ongoing|failed|waiting|completed"
}
```

---

#### Update Goal

None

---

#### Delete Goal

Request:

```txt
DELETE /goals/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Goal deleted successfully."
}
```

---

#### Verify Goal Completion

Request:

```txt
POST /goals/<id>/verify
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "method": "<verify_method>",
    "data": "<verify_data>"
  }
]
```

Response:

```txt
{
  "message": "Data successfully sent to server."
}
```

---

### Groups

#### List Groups

Request:

```txt
GET /groups
Authorization: Bearer <token>
```

Response:

```txt
[
  {
    "id": "<group_id>",
    "name": "<group_name>",
    "stake": "<goal_stake>",
    "deadline_rrule": "<goal_deadline_rrule>",
    "status": "<goal_status>"
  }
]
```

---

#### Get Group Details

Request:

```txt
GET /groups/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<group_id>",
  "name": "<group_name>",
  "members": ["{<user1>, <display_name1>}", "{<user2>, <display_name2>}"],
  "stake": "<goal_stake>",
  "deadline_rrule": "<goal_deadline_rrule>",
  "status": "<goal_status>",
  "start_date": "<goal_start_date>",
  "end_date": "<goal_end_date>",
  "description": "<group_description>"
}
```

---

#### Create Group

Request:

```txt
POST /groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "<group_name>",
  "description": "<group_description>"
}
```

Response:

```txt
{
  "id": "<group_id>",
  "invite_link": "<invite_link>"
}
```

---

#### Get Invite Link

Request:

```txt
GET /groups/<id>/invite
Authorization: Bearer <token>
```

Response:

```txt
{
  "invite_link": "<invite_link>"
}
```

---

#### Verify Invite Link

Request:

```txt
GET /groups/<id>/invite/verify
Authorization: Bearer <token>
```

Response:

```txt
{
  "valid": true|false
}
```

---

#### View Goal

Request:

```txt
GET /groups/<id>/goal
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<goal_id>",
  "title": "<goal_title>",
  "stake": "<goal_stake>",
  "deadline_rrule": "<goal_deadline_rrule>",
  "group_name": "<goal_group_name>",
  "start_date": "<goal_start_date>",
  "end_date": "<goal_end_date>",
  "beneficiary": "<goal_beneficiary>",
  "description": "<goal_description>",
  "verification_window": "<goal_verification_window>",
  "status": "upcoming|ongoing|failed|waiting|completed"
}
```

---

#### Verify Group Goal Completion

Request:

```txt
POST /goals/<id>/verify
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "method": "<verify_method>",
    "data": "<verify_data>"
  }
]
```

Response:

```txt
{
    "message": "Data successfully sent to server."
}
```

---

#### Leave Group

Request:

```txt
POST /groups/<id>/leave
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Left group successfully."
}
```

---

## Section 4 - Examples

### 1. Signup and Fetch Profile

Request:

```txt
POST /signup
Content-Type: application/json

{
  "method": "google",
  "token": "ya29.a0AWY7..."
}
```

Response (201 Created):

```txt
{
  "id": "user_12345"
}
```

---

Request:

```txt
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "id": "user_12345",
  "username": "johndoe",
  "display_name": "John Doe",
  "email": "john.doe@example.com",
  "stripe_status": "inactive"
}
```

### 2. Create and Verify a Goal

Request:

```txt
POST /goals
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "title": "Run 5km every morning",
  "stake": "50 USD",
  "deadline_rrule": "FREQ=DAILY;COUNT=30",
  "group_name": null
}
```

Response (201 Created):

```txt
{
  "id": "goal_789",
  "message": "Goal created successfully."
}
```

---

Request:

```txt
POST /goals/goal_789/verify
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

[
  {
    "method": "photo",
    "data": "iVBORw0KGgoAAAANSUhEUgAAAXcAA..."
  }
]
```

Response (200 OK):

```txt
{
  "message": "Data successfully sent to server."
}
```

### 3. Create a Group and Set Goal

Request:

```txt
POST /groups
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "name": "Morning Runners",
  "description": "Accountability group for daily 5km runs."
}
```

Response (201 Created):

```txt
{
  "id": "group_456",
  "invite_link": "https://commit.app/invite/group_456"
}
```

---

Request:

```txt
GET /groups/group_456/goal
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "id": "goal_789",
  "title": "Run 5km every morning",
  "stake": "50 USD",
  "deadline_rrule": "FREQ=DAILY;COUNT=30",
  "group_name": "Morning Runners",
  "start_date": "2025-09-01",
  "end_date": "2025-09-30",
  "beneficiary": "SaveTheChildren",
  "description": "Daily morning accountability run for 30 days.",
  "verification_window": "06:00-09:00",
  "status": "ongoing"
}
```

### 4. Leave a Group

Request:

```txt
POST /groups/group_456/leave
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "message": "Left group successfully."
}
```

### 5. Error Example – Goal Verification Failure (File Too Large)

Request:

```txt
POST /goals/goal_789/verify
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

[
  {
    "method": "photo",
    "data": "<very_large_base64_string>"
  }
]
```

Response:

```txt
{
  "error": "Payload too large",
  "code": 413,
  "message": "Verification data exceeds the 5MB limit."
}
```
