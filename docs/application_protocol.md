# The Commit protocol - RESTful API

## Section 1 - Overview

The Commit mobile app API allows clients (mobile apps) to manage accounts, goals, and groups. It is a RESTful API, where resources (users, goals, groups...) are accessed via URLs, and actions are performed using HTTP methods (GET, POST, PUT, DELETE).

Clients must authenticate using a Bearer token (except `/api/auth/*`) for all requests. Responses are JSON-formatted, and standard HTTP status codes are used to indicate success or failure.

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
> - `403 Forbidden` - access denied
> - `404 Not Found` - resource does not exist
> - `409 Conflict` - resource conflict (e.g., already exists, cannot delete due to state)
> - `422 Unprocessable Entity` - validation error
> - `500 Internal Server Error` - server error

## Section 3 - Endpoints summary

- Auth (Better-Auth/Hono)
  - /api/auth/\*

- Users
  - GET /api/users
  - PUT /api/users
  - DELETE /api/users

- Goals
  - GET /api/goals
  - POST /api/goals
  - GET /api/goals/:id
  - DELETE /api/goals/:id
  - POST /api/goals/:id/checkin
  - POST /api/goals/:id/photo
  - POST /api/goals/:id/movement/start
  - POST /api/goals/:id/movement/violate
  - GET /api/goals/review (reviewer)
  - PUT /api/goals/review (reviewer)

- Groups
  - GET /api/groups
  - POST /api/groups
  - GET /api/groups/:id
  - DELETE /api/groups/:id
  - POST /api/groups/:id/leave
  - GET /api/groups/:id/invite (owner)
  - GET /api/groups/:id/invite/verify
  - POST /api/groups/join

- Payments
  - POST /api/payments/setup-intent
  - GET /api/payments/method

- Files
  - POST /api/files/upload
  - GET /api/files/:key

## Section 4 - Messages / Requests

> [!NOTE]
> Auth endpoints are provided by Better-Auth/Hono at `/api/auth/*`.

### User

#### Get User

Request:

```txt
GET /api/users
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<user_id>",
  "name": "<name>",
  "email": "<email>",
  "emailVerified": true|false,
  "image": "<image_url|null>",
  "role": "user|reviewer|admin",
  "timezone": "<IANA timezone>",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### Update User

Request:

```txt
PUT /api/users
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
  "id": "<user_id>",
  "name": "<name>",
  "email": "<email>",
  "emailVerified": true|false,
  "image": "<image_url|null>",
  "role": "user|reviewer|admin",
  "timezone": "<IANA timezone>",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### Delete Account

Request:

```txt
DELETE /api/users
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
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "<goal_name>",
  "description": "<string|null>",
  "startDate": "<iso>",
  "endDate": "<iso|null>",
  "dueStartTime": "<iso|null>",
  "dueEndTime": "<iso|null>",
  "localDueStart": "<HH:MM|null>",
  "localDueEnd": "<HH:MM|null>",
  "recDaysMask": "<number|null>",
  "stakeCents": <number>,
  "destinationType": "none|user|charity",
  "destinationUserId": "<uuid|null>",
  "destinationCharityId": "<uuid|null>",
  "method": "checkin|photo|movement",
  "graceTimeSeconds": <number|null>,
  "durationSeconds": <number|null>,
  "geoLat": <number|null>,
  "geoLng": <number|null>,
  "geoRadiusM": <number|null>
}
```

Response:

```txt
{
  "id": "<goal_id>",
  "name": "...",
  "method": "checkin|photo|movement",
  "stakeCents": 1000,
  "destinationType": "none|user|charity",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### List Goals

Request:

```txt
GET /api/goals
Authorization: Bearer <token>
```

Response:

```txt
[
  {
    "id": "<goal_id>",
    "name": "...",
    "groupId": "<group_id|null>",
    "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
    "occurrence": { ... } | null,
    "actions": ["checkin"|"photo"|"movement:start"|"movement:stop", ...],
    "nextTransitionAt": "<iso|null>"
  }
]
```

---

#### Get Goal Details

Request:

```txt
GET /api/goals/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<goal_id>",
  "name": "...",
  "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
  "occurrence": { ... } | null,
  "actions": [ ... ],
  "nextTransitionAt": "<iso|null>"
}
```

---

#### Delete Goal

Request:

```txt
DELETE /api/goals/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Goal deleted successfully."
}
```

---

#### Goal Actions

##### Check-in (auto-approve)

Request:

```txt
POST /api/goals/<id>/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "occurrenceDate": "<YYYY-MM-DD|null>"
}
```

Response:

```txt
{
  "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
  "occurrence": { ... } | null,
  "actions": [ ... ],
  "nextTransitionAt": "<iso|null>"
}
```

---

##### Submit Photo (pending review)

Request:

```txt
POST /api/goals/<id>/photo
Authorization: Bearer <token>
Content-Type: application/json

{
  "photoUrl": "</api/files/...>",
  "occurrenceDate": "<YYYY-MM-DD|null>"
}
```

Response:

```txt
{
  "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
  "occurrence": { ... } | null,
  "actions": [ ... ],
  "nextTransitionAt": "<iso|null>"
}
```

---

##### Movement Start

Request:

```txt
POST /api/goals/<id>/movement/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "occurrenceDate": "<YYYY-MM-DD|null>"
}
```

Response:

```txt
{
  "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
  "occurrence": { ... } | null,
  "actions": [ ... ],
  "nextTransitionAt": "<iso|null>"
}
```

---

##### Movement Stop

Request:

```txt
POST /api/goals/<id>/movement/stop
Authorization: Bearer <token>
Content-Type: application/json

{
  "occurrenceDate": "<YYYY-MM-DD|null>"
}
```

Response:

```txt
{
  "state": "<scheduled|ongoing|window_open|awaiting_verification|passed|missed|failed|expired|>",
  "occurrence": { ... } | null,
  "actions": [ ... ],
  "nextTransitionAt": "<iso|null>"
}
```

---

#### Review (reviewer only)

##### List Pending Photo Validations

Request:

```txt
GET /api/goals/review
Authorization: Bearer <token>
```

Response:

```txt
[
  {
    "goalId": "<uuid>",
    "userId": "<uuid>",
    "occurrenceDate": "<YYYY-MM-DD>",
    "photoUrl": "<absolute_url>",
    "createdAt": "<iso>"
  }
]
```

---

##### Update Validation Decision

Request:

```txt
PUT /api/goals/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "goalId": "<uuid>",
  "userId": "<uuid>",
  "occurrenceDate": "<YYYY-MM-DD>",
  "approvalStatus": "approved|rejected"
}
```

Response:

```txt
{
  "message": "Review updated successfully."
}
```

### Groups

#### List Groups

Request:

```txt
GET /api/groups
Authorization: Bearer <token>
```

Response:

```txt
[
  {
    "id": "<group_id>",
    "name": "<group_name>",
    "description": "<string|null>",
    "ownerId": "<user_id>",
    "goalState": "<computed_goal_state>",
    "createdAt": "<iso>",
    "updatedAt": "<iso>"
  }
]
```

---

#### Get Group Details

Request:

```txt
GET /api/groups/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "id": "<group_id>",
  "name": "<group_name>",
  "description": "<string|null>",
  "ownerId": "<user_id>",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### Create Group

Request:

```txt
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "<group_name>",
  "description": "<string|null>",
  "goal": {
    "name": "<goal_name>",
    "description": "<string|null>",
    "startDate": "<iso>",
    "endDate": "<iso|null>",
    "dueStartTime": "<iso|null>",
    "dueEndTime": "<iso|null>",
    "localDueStart": "<HH:MM|null>",
    "localDueEnd": "<HH:MM|null>",
    "recDaysMask": "<number|null>",
    "stakeCents": <number>,
    "destinationType": "none|user|charity",
    "destinationUserId": "<uuid|null>",
    "destinationCharityId": "<uuid|null>",
    "method": "checkin|photo|movement",
    "graceTimeSeconds": <number|null>,
    "durationSeconds": <number|null>,
    "geoLat": <number|null>,
    "geoLng": <number|null>,
    "geoRadiusM": <number|null>
  }
}
```

Response:

```txt
{
  "id": "<group_id>",
  "name": "<group_name>",
  "description": "<string|null>",
  "inviteCode": "<invite_code>",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### Get Invite Link

Request:

```txt
GET /api/groups/<id>/invite
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
GET /api/groups/<id>/invite/verify?code=<invite_code>
Authorization: Bearer <token>
```

Response:

```txt
{
  "valid": true|false
}
```

---

#### Join Group by Code

Request:

```txt
POST /api/groups/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "<invite_code>"
}
```

Response:

```txt
{
  "id": "<group_id>",
  "name": "<group_name>",
  "description": "<string|null>",
  "ownerId": "<user_id>",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

---

#### Leave Group

Request:

```txt
POST /api/groups/<id>/leave
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Left group successfully."
}
```

---

#### Delete Group (owner only)

Request:

```txt
DELETE /api/groups/<id>
Authorization: Bearer <token>
```

Response:

```txt
{
  "message": "Group and associated goal deleted."
}
```

### Payments

#### Create Setup Intent

Request:

```txt
POST /api/payments/setup-intent
Authorization: Bearer <token>
```

Response:

```txt
{
  "clientSecret": "seti_..._secret_..."
}
```

---

#### Get Payment Method

Request:

```txt
GET /api/payments/method
Authorization: Bearer <token>
```

Response:

```txt
{
  "paymentMethod": {
    "id": "<payment_method_id>",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242"
    }
  }
}
```

### Files

#### Upload File

Request:

```txt
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<binary_data>
```

Response:

```txt
{
  "url": "/api/files/users/.../file.jpg",
  "key": "users/.../file.jpg"
}
```

---

#### Get File

Request:

```txt
GET /api/files/<key>
Authorization: Bearer <token>
```

Response:

```txt
<binary_file_data>
```

## Section 5 - Examples

### 1. Fetch User

Request:

```txt
GET /api/users
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

### 2. Create and Act on a Goal

Request:

```txt
POST /api/goals
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "name": "Run 5km every morning",
  "description": "Daily accountability run",
  "stakeCents": 5000,
  "startDate": "2025-09-01T06:00:00Z",
  "dueStartTime": "2025-09-01T06:00:00Z",
  "dueEndTime": "2025-09-01T09:00:00Z",
  "method": "photo",
  "destinationType": "charity",
  "destinationCharityId": "charity_111"
}
```

Response (200 OK):

```txt
{
  "id": "goal_789",
  "name": "Run 5km every morning",
  "method": "photo",
  "stakeCents": 5000
}
```

---

Request:

```txt
POST /api/goals/goal_789/photo
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "photoUrl": "/api/files/users/user_12345/2025/09/02/abc.jpg",
  "occurrenceDate": "2025-09-02"
}
```

Response:

```txt
{
  "state": "awaiting_verification",
  "occurrence": { ... },
  "actions": [ ... ]
}
```

### 3. Create a Group (with embedded goal) and Join via Code

Request:

```txt
POST /api/groups
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "name": "Morning Runners",
  "description": "Accountability group for daily 5km runs.",
  "goal": {
    "name": "Run 5km every morning",
    "startDate": "2025-09-01T06:00:00Z",
    "stakeCents": 5000,
    "method": "photo"
  }
}
```

Response (200 OK):

```txt
{
  "id": "group_456",
  "inviteCode": "ABC123"
}
```

Request:

```txt
POST /api/groups/join
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "code": "ABC123"
}
```

Response (200 OK):

```txt
{
  "id": "group_456",
  "name": "Morning Runners",
  "description": "Accountability group for daily 5km runs.",
  "ownerId": "user_67890",
  "createdAt": "2025-09-01T10:00:00Z",
  "updatedAt": "2025-09-01T10:00:00Z"
}
```

### 4. Leave a Group

Request:

```txt
POST /api/groups/group_456/leave
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "message": "Left group successfully."
}
```

### 5. Payments and Files

Request:

```txt
POST /api/payments/setup-intent
Authorization: Bearer <token>
```

Response:

```txt
{
  "clientSecret": "seti_..._secret_..."
}
```

Request:

```txt
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<binary>
```

Response:

```txt
{
  "url": "/api/files/users/.../file.jpg",
  "key": "users/.../file.jpg"
}
```

### 6. Invalid Group Invite Code (example)

Request:

```txt
GET /api/groups/group_456/invite/verify?code=WRONGCODE
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Response (200 OK):

```txt
{
  "valid": false
}
```
