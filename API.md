# API Documentation

## Overview

The "Where My Cash Went" API is a NestJS-based backend service that allows users to track their personal finances. Users can manage categories, transactions, tags, and recurring periodic transactions to monitor income and expenses.

The API follows **Hexagonal Architecture** principles, providing a clean separation between domain logic and infrastructure.

---

## Base URL

```
http://localhost:3000
```

All endpoints are relative to the base URL.

---

## Authentication

The API uses **better-auth** for authentication with both email/password and Google OAuth support.

### Auth Base Path

All authentication endpoints are prefixed with `/auth`.

### Endpoints

#### POST /auth/sign-up

Register a new user with email and password.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response** `201 Created`

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "image": null
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /auth/sign-in

Sign in with email and password.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "image": null
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /auth/sign-out

Sign out the current session.

**Auth Required:** Yes (session token in cookie)

**Response** `200 OK`

```json
{
  "message": "Sign out successful"
}
```

---

#### GET /auth/session

Get the current authenticated user's session information.

**Auth Required:** Yes

**Response** `200 OK`

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "image": null
  },
  "session": {
    "token": "session-token-string",
    "expiresAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /auth/callback/google

Google OAuth callback endpoint. Initiate Google OAuth flow by redirecting the user to this endpoint (the OAuth provider will handle the redirect).

**Auth Required:** No

**Response** `302 Redirect`

Redirects to Google's OAuth consent screen. After user authorization, Google redirects back with tokens for session creation.

---

## Data Types & Enums

### Transaction_T

Represents the type of a transaction.

| Value | Description |
|-------|-------------|
| `income` | Money coming in |
| `expense` | Money going out |

---

### Cycle_T

Represents the recurrence cycle for periodic transactions.

| Value | Description |
|-------|-------------|
| `daily` | Repeats every day |
| `weekly` | Repeats every week |
| `fortnightly` | Repeats every two weeks |
| `monthly` | Repeats every month |
| `quarterly` | Repeats every three months |
| `biannual` | Repeats every six months |
| `yearly` | Repeats once a year |
| `custom` | Custom duration (requires `duration` field) |

---

## Resources

All resource endpoints (Categories, Transactions, Tags, Periodics) require authentication unless marked as **Public**.

### User Context

Authenticated endpoints receive the user ID from the session cookie. The `session` parameter is automatically populated by the `better-auth` middleware.

---

## Health Check

### GET /health

Public endpoint to check API and database health status.

**Auth Required:** No

**Response** `200 OK` (when healthy)

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response** `503 Service Unavailable` (when unhealthy)

```json
{
  "status": "error",
  "database": "disconnected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Tags

Tags are user-defined labels that can be attached to transactions for categorization.

### Create Tag

**POST** `/tags`

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "groceries"
}
```

Or create multiple tags at once:

```json
[
  { "name": "groceries" },
  { "name": "dining" },
  { "name": "transport" }
]
```

**Response** `201 Created`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "groceries",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### List Tags

**GET** `/tags`

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | `"0"` | Page number (0-indexed) |
| `limit` | string | `"10"` | Items per page |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "groceries",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 0,
  "limit": 10,
  "count": 1
}
```

---

### Get Tag by ID

**GET** `/tags/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Tag ID |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "groceries",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Update Tag

**PUT** `/tags/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Tag ID |

**Request Body:**

```json
{
  "name": "food"
}
```

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "food",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Delete Tag

**DELETE** `/tags/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Tag ID |

**Response** `204 No Content`

---

## Categories

Categories are used to classify transactions. Each category has a name, a Unicode character for visual representation, and is tied to a transaction type (income or expense).

### Create Category

**POST** `/categories`

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "Salary",
  "unicode": "💰",
  "transactionType": "income"
}
```

Or create multiple categories at once:

```json
[
  {
    "name": "Salary",
    "unicode": "💰",
    "transactionType": "income"
  },
  {
    "name": "Rent",
    "unicode": "🏠",
    "transactionType": "expense"
  }
]
```

**Response** `201 Created`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "Salary",
      "unicode": "💰",
      "transactionType": "income",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### List Categories

**GET** `/categories`

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | `"0"` | Page number (0-indexed) |
| `limit` | string | `"10"` | Items per page |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "Salary",
      "unicode": "💰",
      "transactionType": "income",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 0,
  "limit": 10,
  "count": 1
}
```

---

### Get Category by ID

**GET** `/categories/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Category ID |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "Salary",
      "unicode": "💰",
      "transactionType": "income",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Update Category

**PUT** `/categories/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Category ID |

**Request Body:**

```json
{
  "name": "Monthly Salary",
  "unicode": "💵"
}
```

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "name": "Monthly Salary",
      "unicode": "💵",
      "transactionType": "income",
      "userId": "uuid-string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Delete Category

**DELETE** `/categories/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Category ID |

**Response** `204 No Content`

---

## Transactions

Transactions represent individual financial events (income or expense entries).

### Create Transaction

**POST** `/transactions`

**Auth Required:** Yes

**Request Body:**

```json
{
  "quantity": 1500,
  "description": "Monthly salary deposit",
  "categoryId": "uuid-string",
  "tags": ["uuid-string-1", "uuid-string-2"],
  "transactionType": "income"
}
```

Or create multiple transactions at once:

```json
[
  {
    "quantity": 1500,
    "description": "Monthly salary deposit",
    "categoryId": "uuid-string",
    "transactionType": "income"
  },
  {
    "quantity": 120,
    "description": "Grocery shopping",
    "categoryId": "uuid-string-2",
    "tags": ["uuid-string-1"],
    "transactionType": "expense"
  }
]
```

**Response** `201 Created`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "quantity": 1500,
      "description": "Monthly salary deposit",
      "userId": "uuid-string",
      "categoryId": "uuid-string",
      "transactionType": "income",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": "uuid-string",
        "name": "Salary"
      },
      "tags": [
        { "id": "uuid-string-1", "name": "groceries" }
      ]
    }
  ],
  "count": 1
}
```

---

### List Transactions

**GET** `/transactions`

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | `"0"` | Page number (0-indexed) |
| `limit` | string | `"10"` | Items per page |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "quantity": 1500,
      "description": "Monthly salary deposit",
      "userId": "uuid-string",
      "categoryId": "uuid-string",
      "transactionType": "income",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": "uuid-string",
        "name": "Salary"
      },
      "tags": [
        { "id": "uuid-string-1", "name": "groceries" }
      ]
    }
  ],
  "page": 0,
  "limit": 10,
  "count": 1
}
```

---

### Get Transaction by ID

**GET** `/transactions/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Transaction ID |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "quantity": 1500,
      "description": "Monthly salary deposit",
      "userId": "uuid-string",
      "categoryId": "uuid-string",
      "transactionType": "income",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": "uuid-string",
        "name": "Salary"
      },
      "tags": [
        { "id": "uuid-string-1", "name": "groceries" }
      ]
    }
  ],
  "count": 1
}
```

---

### Update Transaction

**PUT** `/transactions/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Transaction ID |

**Request Body:**

```json
{
  "quantity": 1600,
  "description": "Updated salary amount"
}
```

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "quantity": 1600,
      "description": "Updated salary amount",
      "userId": "uuid-string",
      "categoryId": "uuid-string",
      "transactionType": "income",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z",
      "category": {
        "id": "uuid-string",
        "name": "Salary"
      },
      "tags": []
    }
  ],
  "count": 1
}
```

---

### Delete Transaction

**DELETE** `/transactions/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Transaction ID |

**Response** `204 No Content`

---

## Periodics

Periodics represent recurring transaction templates. They define when a transaction should automatically repeat based on a cycle.

### Create Periodic

**POST** `/periodics`

**Auth Required:** Yes

**Request Body:**

```json
{
  "cycle": "monthly",
  "transactionId": "uuid-string",
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

For custom cycles, include the `duration` field (in days):

```json
{
  "cycle": "custom",
  "duration": 45,
  "transactionId": "uuid-string",
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

**Response** `201 Created`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "transactionId": "uuid-string",
      "cycle": "monthly",
      "duration": null,
      "nextOcurrence": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### List Periodics

**GET** `/periodics`

**Auth Required:** Yes

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "transactionId": "uuid-string",
      "cycle": "monthly",
      "duration": null,
      "nextOcurrence": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Get Periodic by ID

**GET** `/periodics/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Periodic ID |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "transactionId": "uuid-string",
      "cycle": "monthly",
      "duration": null,
      "nextOcurrence": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Update Periodic

**PUT** `/periodics/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Periodic ID |

**Request Body:**

```json
{
  "cycle": "quarterly"
}
```

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid-string",
      "transactionId": "uuid-string",
      "cycle": "quarterly",
      "duration": null,
      "nextOcurrence": "2024-04-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Delete Periodic

**DELETE** `/periodics/:id`

**Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Periodic ID |

**Response** `204 No Content`

---

## Error Handling

The API returns standard HTTP status codes for errors.

### Status Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `204` | No Content (successful deletion) |
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Missing or invalid session |
| `403` | Forbidden - User does not own the resource |
| `404` | Not Found - Resource does not exist |
| `409` | Conflict - Duplicate resource |
| `422` | Unprocessable Entity - Validation failed |
| `500` | Internal Server Error |
| `503` | Service Unavailable - Database connection failed |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "quantity",
      "message": "quantity must be an integer"
    }
  ]
}
```

---

## Entity Schemas

### TagProps

```typescript
{
  id: string;           // UUID
  name: string;        // User-defined tag name
  userId: string;       // Owner's UUID
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;     // Last update timestamp
}
```

---

### CategoryProps

```typescript
{
  id: string;              // UUID
  name: string;            // Category name
  unicode: string;         // Unicode character for UI
  transactionType: Transaction_T;  // 'income' | 'expense'
  userId: string;          // Owner's UUID
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

---

### TransactionProps

```typescript
{
  id: string;              // UUID
  quantity: number;        // Amount (integer)
  description: string;     // Transaction description
  userId: string;           // Owner's UUID
  categoryId: string | null;   // Linked category UUID or null
  transactionType: Transaction_T | null;  // 'income' | 'expense' | null
  createdAt: Date;          // Creation timestamp
  updatedAt: Date;          // Last update timestamp
}
```

---

### TransactionWithRelations

```typescript
{
  id: string;
  quantity: number;
  description: string;
  userId: string;
  categoryId: string | null;
  transactionType: Transaction_T | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string } | null;  // Included category info
  tags?: Array<{ id: string; name: string }>;       // Array of associated tags
}
```

---

### PeriodicProps

```typescript
{
  id: string;              // UUID
  transactionId: string;  // Reference to the template transaction
  cycle: Cycle_T;         // Recurrence cycle enum value
  duration: number | null; // Custom duration in days (only for 'custom' cycle)
  nextOcurrence: Date;    // Next scheduled occurrence
  createdAt: Date;        // Creation timestamp
  updatedAt: Date;        // Last update timestamp
}
```
