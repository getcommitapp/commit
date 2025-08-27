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
> - `500 Internal Server Error` - server error

## Section 3 - Messages / Requests

> [!NOTE]
> Endpoint `/auth` has been created by Better-Auth/Hono

### Profile

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
  "name": "<new_name>",
}
```

> [!WARNING]
> Only the `name` can be changed !

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
    "name": "<goal_name>",
    "description": "<goal_description>",
    "stake_cents": <stake_cents>,
    "currency": "<currency>",
    "recurrence": "<recurrence_json>",
    "start_date": "<start_date>",
    "end_date": "<end_date>",
    "due_start_time": "<due_start_time>",
    "due_end_time": "<due_end_time>",
    "destination_type": "dev|charity",
    "destination_user_id": "<user_id|null>",
    "destination_charity_id": "<charity_id|null>"
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
  "name": "<goal_name>",
  "description": "<goal_description>",
  "stake_cents": <stake_cents>,
  "currency": "<currency>",
  "recurrence": "<recurrence_json>",
  "start_date": "<start_date>",
  "end_date": "<end_date>",
  "due_start_time": "<due_start_time>",
  "due_end_time": "<due_end_time>",
  "destination_type": "dev|charity",
  "destination_user_id": "<user_id|null>",
  "destination_charity_id": "<charity_id|null>",
  "verification_methods": [
    {
      "method": "<method_type>",
      "latitude": "<latitude|null>",
      "longitude": "<longitude|null>",
      "radius_m": "<radius|null>",
      "duration_seconds": "<duration|null>",
      "grace_time": "<grace_time|null>"
    }
  ]
}
```

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
    "type": "<verification_type>",
    "photo_url": "<photo_url|null>",
    "photo_description": "<description|null>",
    "start_time": "<start_time|null>"
  }
]
```

Response:

```txt
{
  "message": "Verification log submitted."
}
```

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
    "description": "<group_description>",
    "goal_id": "<goal_id|null>",
    "invite_code": "<invite_code>"
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
  "description": "<group_description>",
  "creator_id": "<user_id>",
  "goal_id": "<goal_id|null>",
  "invite_code": "<invite_code>",
  "members": [
    {
      "user_id": "<user_id>",
      "status": "<member_status>",
      "joined_at": "<joined_at>"
    }
  ]
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
  "invite_code": "<invite_code>"
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
  "invite_code": "<invite_code>"
}
```

---

#### Verify Invite Link

Request:

```txt
GET /groups/<id>/invite/verify?code=<invite_code>
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
  "name": "<goal_name>",
  "description": "<goal_description>",
  "stake_cents": <stake_cents>,
  "currency": "<currency>",
  "recurrence": "<recurrence_json>",
  "start_date": "<start_date>",
  "end_date": "<end_date>",
  "due_start_time": "<due_start_time>",
  "due_end_time": "<due_end_time>",
  "destination_type": "dev|charity",
  "destination_user_id": "<user_id|null>",
  "destination_charity_id": "<charity_id|null>",
  "verification_methods": [
    {
      "method": "<method_type>",
      "latitude": "<latitude|null>",
      "longitude": "<longitude|null>",
      "radius_m": "<radius|null>",
      "duration_seconds": "<duration|null>",
      "grace_time": "<grace_time|null>"
    }
  ]
}
```

---

#### Verify Group Goal Completion

Request:

```txt
POST /groups/<id>/goal/verify
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "type": "<verification_type>",
    "photo_url": "<photo_url|null>",
    "photo_description": "<description|null>",
    "start_time": "<start_time|null>"
  }
]
```

Response:

```txt
{
  "message": "Verification log submitted."
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

## Section 4 - Examples

### 1. Fetch Profile

Request:

```txt
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "id": "user_12345",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "image": "https://example.com/avatar.png",
  "email_verified": true
}
```

### 2. Create and Verify a Goal

Request:

```txt
POST /goals
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "name": "Run 5km every morning",
  "description": "Daily accountability run",
  "stake_cents": 5000,
  "currency": "CHF",
  "recurrence": {
    "freq": "DAILY",
    "count": 30
  },
  "start_date": "2025-09-01T06:00:00Z",
  "end_date": "2025-09-30T06:00:00Z",
  "due_start_time": "2025-09-01T06:00:00Z",
  "due_end_time": "2025-09-01T09:00:00Z",
  "destination_type": "charity",
  "destination_charity_id": "charity_111"
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
    "type": "photo",
    "photo_url": "https://cdn.commit.app/uploads/run1.jpg",
    "photo_description": "Morning run selfie",
    "start_time": "2025-09-02T06:30:00Z"
  }
]
```

Response (200 OK):

```txt
{
  "message": "Verification log submitted."
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
  "invite_code": "ABC123"
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
  "name": "Run 5km every morning",
  "description": "Daily accountability run",
  "stake_cents": 5000,
  "currency": "USD",
  "recurrence": {
    "freq": "DAILY",
    "count": 30
  },
  "start_date": "2025-09-01T06:00:00Z",
  "end_date": "2025-09-30T06:00:00Z",
  "due_start_time": "2025-09-01T06:00:00Z",
  "due_end_time": "2025-09-01T09:00:00Z",
  "destination_type": "charity",
  "destination_charity_id": "charity_111",
  "verification_methods": [
    {
      "method": "photo",
      "grace_time": null
    }
  ]
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

### 5. Error Example – Invalid Group Invite Code

Request:

```txt
GET /groups/group_456/invite/verify?code=WRONGCODE
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response:

```txt
{
  "error": "Bad Request",
  "code": 400,
  "message": "The provided invite code is not valid."
}
```
