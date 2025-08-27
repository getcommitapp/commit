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

### User

#### Get User

Request:

```txt
GET /user
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<user_id>",
  "name": "<name>",
  "email": "<email>",
  "emailVerified": true|false,
  "image": "<image_url|null>"
}
```

---

#### Update User

Request:

```txt
PUT /user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "<new_name>"
}
```

> [!WARNING]
> Only the `name` can be changed !

Response:

```txt
{
  "message": "User updated successfully."
}
```

---

#### Delete Account

Request:

```txt
DELETE /user
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Account deleted successfully."
}
```

### Goals

#### Create Goal

Request:

```txt
POST /goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "<goal_name>",
  "description": "<goal_description>",
  "stakeCents": <stake_cents>,
  "currency": "<currency>",
  "recurrence": "<recurrence_json>",
  "startDate": "<start_date>",
  "endDate": "<end_date>",
  "dueStartTime": "<due_start_time>",
  "dueEndTime": "<due_end_time>",
  "destinationType": "dev|charity",
  "destinationUserId": "<user_id|null>",
  "destinationCharityId": "<charity_id|null>"
}
```

Response:

```txt
{
  "id": "<goal_id>",
  "message": "Goal created successfully."
}
```

---

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
    "stakeCents": <stake_cents>,
    "currency": "<currency>",
    "recurrence": "<recurrence_json>",
    "startDate": "<start_date>",
    "endDate": "<end_date>",
    "dueStartTime": "<due_start_time>",
    "dueEndTime": "<due_end_time>",
    "destinationType": "dev|charity",
    "destinationUserId": "<user_id|null>",
    "destinationCharityId": "<charity_id|null>"
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
  "stakeCents": <stake_cents>,
  "currency": "<currency>",
  "recurrence": "<recurrence_json>",
  "startDate": "<start_date>",
  "endDate": "<end_date>",
  "dueStartTime": "<due_start_time>",
  "dueEndTime": "<due_end_time>",
  "destinationType": "dev|charity",
  "destinationUserId": "<user_id|null>",
  "destinationCharityId": "<charity_id|null>",
  "verificationMethods": [
    {
      "method": "<method_type>",
      "latitude": "<latitude|null>",
      "longitude": "<longitude|null>",
      "radiusM": "<radius|null>",
      "durationSeconds": "<duration|null>",
      "graceTime": "<grace_time|null>"
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
    "photoUrl": "<photo_url|null>",
    "photoDescription": "<description|null>",
    "startTime": "<start_time|null>"
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
    "goalId": "<goal_id|null>",
    "inviteCode": "<invite_code>"
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
  "creatorId": "<user_id>",
  "goalId": "<goal_id|null>",
  "inviteCode": "<invite_code>",
  "members": [
    {
      "userId": "<user_id>",
      "status": "<member_status>",
      "joinedAt": "<joined_at>"
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
  "inviteCode": "<invite_code>"
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
  "inviteCode": "<invite_code>"
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
  "stakeCents": <stake_cents>,
  "currency": "<currency>",
  "recurrence": "<recurrence_json>",
  "startDate": "<start_date>",
  "endDate": "<end_date>",
  "dueStartTime": "<due_start_time>",
  "dueEndTime": "<due_end_time>",
  "destinationType": "dev|charity",
  "destinationUserId": "<user_id|null>",
  "destinationCharityId": "<charity_id|null>",
  "verificationMethods": [
    {
      "method": "<method_type>",
      "latitude": "<latitude|null>",
      "longitude": "<longitude|null>",
      "radiusM": "<radius|null>",
      "durationSeconds": "<duration|null>",
      "graceTime": "<grace_time|null>"
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
    "photoUrl": "<photo_url|null>",
    "photoDescription": "<description|null>",
    "startTime": "<start_time|null>"
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

### 1. Fetch User

Request:

```txt
GET /user
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "id": "user_12345",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "image": "https://example.com/avatar.png",
  "emailVerified": true
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
  "stakeCents": 5000,
  "currency": "CHF",
  "recurrence": {
    "freq": "DAILY",
    "count": 30
  },
  "startDate": "2025-09-01T06:00:00Z",
  "endDate": "2025-09-30T06:00:00Z",
  "dueStartTime": "2025-09-01T06:00:00Z",
  "dueEndTime": "2025-09-01T09:00:00Z",
  "destinationType": "charity",
  "destinationCharityId": "charity_111"
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
    "photoUrl": "https://cdn.commit.app/uploads/run1.jpg",
    "photoDescription": "Morning run selfie",
    "startTime": "2025-09-02T06:30:00Z"
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
  "inviteCode": "ABC123"
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
  "stakeCents": 5000,
  "currency": "USD",
  "recurrence": {
    "freq": "DAILY",
    "count": 30
  },
  "startDate": "2025-09-01T06:00:00Z",
  "endDate": "2025-09-30T06:00:00Z",
  "dueStartTime": "2025-09-01T06:00:00Z",
  "dueEndTime": "2025-09-01T09:00:00Z",
  "destinationType": "charity",
  "destinationCharityId": "charity_111",
  "verificationMethods": [
    {
      "method": "photo",
      "graceTime": null
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
