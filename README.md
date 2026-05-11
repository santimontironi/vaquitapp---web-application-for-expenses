# VaquitApp

VaquitApp is a web application for organizing shared expenses among groups of people. Users create groups, define plans within those groups (e.g., "Sunday barbecue"), register expenses per plan specifying who paid and who shares the cost, and the app calculates the minimum set of transfers needed to settle all debts.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Request & Response Examples](#request--response-examples)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Scripts](#scripts)
- [Roles & Permissions](#roles--permissions)
- [Expense Calculation Logic](#expense-calculation-logic)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend runtime | Node.js + Express.js | Express 5.x |
| Database | MongoDB + Mongoose | Mongoose 9.x |
| Authentication | JSON Web Tokens (httpOnly cookie) | jsonwebtoken 9.x |
| Password hashing | bcryptjs | 3.x |
| File upload | Multer (memory storage) | 2.x |
| Image hosting | Cloudinary | 2.x |
| Email | Nodemailer | 8.x |
| Frontend framework | React + TypeScript | React 19, TS 5.9 |
| Build tool | Vite | 8.x |
| Styling | Tailwind CSS | 4.x |
| HTTP client | Axios | 1.x |
| Forms | React Hook Form | 7.x |
| Alerts | SweetAlert2 | 11.x |
| Icons | Bootstrap Icons | 1.x |

---

## Project Structure

```
VaquitApp/
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   ├── db.config.js
│   │   └── mail.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   ├── group.controller.js
│   │   └── plan.controller.js
│   ├── middlewares/
│   │   ├── multer.js
│   │   ├── validate-object-id.js
│   │   ├── verify-auth.js
│   │   └── verify-role.js
│   ├── models/
│   │   ├── expense.model.js
│   │   ├── group.model.js
│   │   ├── groupMember.model.js
│   │   ├── plan.model.js
│   │   └── user.model.js
│   ├── repository/
│   │   ├── auth.repository.js
│   │   ├── expense.repository.js
│   │   ├── group.repository.js
│   │   └── plan.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── expense.routes.js
│   │   ├── group.routes.js
│   │   └── plan.routes.js
│   ├── app.js
│   ├── index.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── expenses/
        │   │   ├── CreateExpense.tsx
        │   │   ├── ExpenseCard.tsx
        │   │   ├── PaidByPicker.tsx
        │   │   └── SplitPicker.tsx
        │   ├── groups/
        │   │   ├── AddMember.tsx
        │   │   ├── AllMembers.tsx
        │   │   ├── MemberItem.tsx
        │   │   └── SideNavGroup.tsx
        │   ├── layout/
        │   │   └── VerifyAuth.tsx
        │   ├── plans/
        │   │   ├── AllPlans.tsx
        │   │   ├── CreatePlan.tsx
        │   │   ├── PlanHistory.tsx
        │   │   └── PlanItem.tsx
        │   └── ui/
        │       └── Loader.tsx
        ├── context/
        │   ├── AuthContext.tsx
        │   ├── ExpenseContext.tsx
        │   ├── GroupContext.tsx
        │   └── PlanContext.tsx
        ├── hooks/
        │   ├── useAuth.tsx
        │   ├── useExpense.tsx
        │   ├── useGroup.tsx
        │   └── usePlan.tsx
        ├── pages/
        │   ├── AcceptInvitation.tsx
        │   ├── ConfirmUser.tsx
        │   ├── Dashboard.tsx
        │   ├── Group.tsx
        │   ├── Login.tsx
        │   ├── NewGroup.tsx
        │   ├── PlanDetail.tsx
        │   └── Register.tsx
        ├── services/
        │   ├── auth.service.ts
        │   ├── expenses.service.ts
        │   ├── groups.service.ts
        │   └── plans.service.ts
        ├── types/
        │   ├── auth.types.ts
        │   ├── expense.types.ts
        │   ├── groups.types.ts
        │   └── plans.types.ts
        └── utils/
            └── date.ts
```

---

## Features

### Authentication
- User registration with email confirmation (JWT link, 24 h expiry)
- Login via username or email + password; session stored in `httpOnly` cookie (7-day expiry)
- Account must be confirmed before login is allowed
- Logout clears the session cookie

### Groups
- Create a group with name, description, and optional image (uploaded to Cloudinary)
- View all groups the authenticated user belongs to
- View group details
- Edit group name, description, and image (admin only)
- Soft-delete a group (`active: false`) (admin only)
- Leave a group — blocked if the user is the sole admin

### Group Members
- View all members with their role and join date
- Invite a member by email; sends a signed JWT invitation link (7-day expiry, role included)
- Accept an invitation via token (requires active session on the frontend)
- Promote any member to admin role (admin only)
- Remove a member from the group (admin only)

### Plans
- Create a plan within a group with name, optional description, optional image, and initial member list
- Plan creator is always added to the member list automatically
- View all active plans in a group
- View plan history (completed and cancelled plans)
- Get a single plan by ID with full member and creator details
- Mark a plan as completed (any group member)
- Add new members to an existing plan (members must belong to the group)

### Expenses
- Register an expense within a plan: amount, optional description, who paid, and among whom it is split
- All parties (`paid_by`, each user in `split_among`) must be members of the plan
- List active expenses for a plan (state = `active`)
- List all expenses for a plan regardless of state
- Mark an expense as completed/settled — allowed only to the user who paid or a group admin
- Calculate settlement balances: returns the minimum list of transfers to settle all debts

---

## Data Models

> See Excalidraw ERD: https://excalidraw.com/#json=qtdbviQGrIOk3onpaJiH4,e-pFMZ4woTeBDTWgxPsISg

### User

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `username` | String | yes | Unique username |
| `email` | String | yes | Unique email address |
| `password` | String | yes | Bcrypt hash |
| `isConfirmed` | Boolean | — | `false` until email link is clicked |

### Group

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | yes | Group display name |
| `description` | String | yes | Group description |
| `image` | String | — | Cloudinary URL |
| `created_by` | ObjectId → User | yes | User who created the group |
| `active` | Boolean | — | `false` = soft-deleted (default `true`) |
| `created_at` | Date | — | Creation timestamp |

### GroupMember

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `group` | ObjectId → Group | yes | Reference to the group |
| `user` | ObjectId → User | yes | Reference to the user |
| `role` | String | — | `admin` or `member` (default `member`) |
| `joined_at` | Date | — | When the user joined |

### Plan

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | yes | Plan display name |
| `description` | String | — | Optional description |
| `image` | String | — | Cloudinary URL |
| `group` | ObjectId → Group | yes | Group this plan belongs to |
| `created_by` | ObjectId → User | yes | User who created the plan |
| `members` | [ObjectId → User] | — | Users participating in this plan |
| `state` | String | — | `active`, `completed`, or `cancelled` (default `active`) |
| `created_at` | Date | — | Creation timestamp |

### Expense

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `description` | String | — | Optional label (e.g., "Supermarket") |
| `amount` | Number | yes | Total amount paid; must be > 0 |
| `plan` | ObjectId → Plan | yes | Plan this expense belongs to |
| `paid_by` | ObjectId → User | yes | User who paid the full amount |
| `split_among` | [ObjectId → User] | — | Users sharing the cost |
| `state` | String | — | `active` or `completed` (default `active`) |
| `createdAt` | Date | — | Auto-set by Mongoose timestamps |
| `updatedAt` | Date | — | Auto-set by Mongoose timestamps |

---

## API Endpoints

All endpoints are served relative to the backend base URL (e.g., `http://localhost:3000`).

**Middleware chain for protected group/plan/expense routes:**
`verifyToken` → `validateObjectId(...)` → `verifyRole` → controller

`verifyRole` populates `req.group` and `req.member` (the caller's GroupMember document). Role checks (`admin` vs. `member`) are enforced inside each controller.

### Auth

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user; sends confirmation email |
| POST | `/login` | No | Login with `identifier` (username or email) + `password`; sets session cookie |
| GET | `/confirm/:token` | No | Confirm email address via JWT token |
| GET | `/dashboard` | Yes | Return authenticated user's profile |
| POST | `/logout` | No | Clear session cookie |

### Groups

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/groups` | Yes | Create a new group (multipart/form-data for optional image) |
| GET | `/groups` | Yes | List all groups the authenticated user belongs to |
| GET | `/groups/:idGroup` | Yes + member | Get group details |
| PATCH | `/groups/:idGroup` | Yes + admin | Edit group name, description, and image |
| DELETE | `/groups/:idGroup` | Yes + admin | Soft-delete the group |
| DELETE | `/groups/:idGroup/leave` | Yes + member | Leave the group |

### Group Members

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/groups/:idGroup/members` | Yes + member | List all members with role and join date |
| POST | `/groups/:idGroup/invite` | Yes + admin | Send an email invitation with a signed token |
| GET | `/groups/invite/accept/:token` | No | Accept an invitation and add the user to the group |
| PATCH | `/groups/:idGroup/members/:idMember/admin` | Yes + admin | Promote a member to admin |
| DELETE | `/groups/:idGroup/members/:idMember` | Yes + admin | Remove a member from the group |

### Plans

> Note: plan routes use the prefix `/:idGroup/plans`, not `/groups/:idGroup/plans`.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/:idGroup/plans` | Yes + member | List all active plans in the group |
| GET | `/:idGroup/plans/history` | Yes + member | List completed and cancelled plans |
| GET | `/:idGroup/plans/:idPlan` | Yes + member | Get a single active plan by ID |
| POST | `/:idGroup/plans` | Yes + member | Create a new plan (multipart/form-data) |
| PATCH | `/:idGroup/plans/:idPlan/complete` | Yes + member | Mark a plan as completed |
| PATCH | `/:idGroup/plans/:idPlan/addMembers` | Yes + member | Add group members to an existing plan |

### Expenses

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/groups/:idGroup/plans/:idPlan/expenses` | Yes + member | Register a new expense |
| GET | `/groups/:idGroup/plans/:idPlan/expenses` | Yes + member | List active expenses for a plan |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/all` | Yes + member | List all expenses for a plan (all states) |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/balances` | Yes + member | Calculate and return the settlement transaction list |
| PATCH | `/groups/:idGroup/plans/:idPlan/expenses/:idExpense/complete` | Yes + member | Mark an expense as completed (paid_by user or admin only) |

---

## Request & Response Examples

### POST `/register`

```json
// Request body
{
  "username": "ana",
  "email": "ana@example.com",
  "password": "secret123"
}

// Response 201
{ "message": "Usuario registrado exitosamente" }
```

### POST `/login`

```json
// Request body — accepts username or email in "identifier"
{
  "identifier": "ana",
  "password": "secret123"
}

// Response 200 — sets httpOnly cookie "token"
{
  "message": "Login exitoso",
  "user": { "id": "...", "username": "ana", "email": "ana@example.com" }
}
```

### POST `/groups/:idGroup/invite`

```json
// Request body
{
  "email": "bob@example.com",
  "role": "member"
}

// Response 200
{ "message": "Invitación enviada exitosamente" }
```

The invitation endpoint signs a JWT `{ groupId, email, role }` with a 7-day expiry and emails a link to `FRONTEND_URL/invitacion/<token>`. The frontend requires an active session before rendering the acceptance page.

### POST `/groups/:idGroup/plans/:idPlan/expenses`

```json
// Request body
{
  "description": "Supermarket run",
  "amount": 90,
  "paid_by": "<userId-ana>",
  "split_among": ["<userId-ana>", "<userId-bob>", "<userId-carol>"]
}

// Response 201
{
  "message": "Gasto creado exitosamente",
  "expense": { "_id": "...", "amount": 90, "state": "active", "..." : "..." }
}
```

### GET `/groups/:idGroup/plans/:idPlan/expenses/balances`

```json
// Response 200
{
  "message": "Balances calculados exitosamente",
  "transactions": [
    {
      "from": { "_id": "...", "username": "carol" },
      "to":   { "_id": "...", "username": "ana" },
      "amount": 60
    },
    {
      "from": { "_id": "...", "username": "carol" },
      "to":   { "_id": "...", "username": "bob" },
      "amount": 30
    }
  ]
}
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster/db` |
| `JWT_SECRET` | Secret used to sign all JWT tokens | `a_long_random_string` |
| `FRONTEND_URL` | Frontend origin for CORS and email links | `http://localhost:5173` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `EMAIL_USER` | SMTP sender address | `noreply@vaquitapp.com` |
| `EMAIL_PASS` | SMTP sender password / app password | `smtp_app_password` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | `my_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL used by Axios | `http://localhost:3000` |

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)
- A Cloudinary account
- An SMTP email provider

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` using the variables described above, then:

```bash
npm run dev
```

The server starts on the configured `PORT` (default `3000`).

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

Vite starts the dev server, typically at `http://localhost:5173`.

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `npm start` | Start the server with `node index.js` |
| `npm run dev` | Start with `nodemon` (auto-restart on file change) |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and produce production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the source tree |

---

## Roles & Permissions

| Action | admin | member |
|---|---|---|
| View group details | yes | yes |
| View group members | yes | yes |
| Leave group | yes (blocked if sole admin) | yes |
| Edit group (name, description, image) | yes | no |
| Delete group | yes | no |
| Invite member to group | yes | no |
| Remove member from group | yes | no |
| Promote member to admin | yes | no |
| Create plan | yes | yes |
| View plans / plan history | yes | yes |
| Mark plan as completed | yes | yes |
| Add members to plan | yes | yes |
| Create expense | yes | yes |
| View expenses | yes | yes |
| Get balance/settlement | yes | yes |
| Complete (settle) any expense | yes | no |
| Complete own expense (`paid_by`) | yes | yes |

---

## Expense Calculation Logic

> See Excalidraw diagram: https://excalidraw.com/#json=wsV5aY-OgcicKmYSDt2ID,25dORAP5yLdzb5mXo80hTw

The balance algorithm runs server-side in `expense.controller.js → getBalances` when the client requests `GET .../expenses/balances`. It works in three stages:

**Stage 1 — Build the balance map.**
For every active expense in the plan:
- The `paid_by` user's balance increases by the full `amount` (they are owed this money).
- Each user in `split_among` has their balance decreased by `amount / split_among.length` (their equal share of the cost).

Users with a positive final balance are *creditors* (others owe them money). Users with a negative balance are *debtors*.

**Stage 2 — Greedy pairing.**
Creditors are sorted largest-balance-first; debtors are sorted most-negative-first. In each iteration the largest debtor is paired with the largest creditor. The transfer amount is `min(creditor.balance, |debtor.balance|)`. Both balances are reduced by that amount; any party that reaches zero is removed from their list. This continues until all balances are settled.

This greedy approach guarantees the **minimum number of transactions** required to settle all debts.

**Stage 3 — Rounding.**
Every intermediate and final amount is rounded to 2 decimal places using `Math.round(value * 100) / 100` to prevent floating-point drift.

### Example

| Expense | Paid by | Split among | Net effect |
|---|---|---|---|
| $90 | Ana | Ana, Bob, Carol | Ana +60, Bob -30, Carol -30 |
| $60 | Bob | Bob, Carol | Bob +30, Carol -30 |

Final balances: Ana +60, Bob +30, Carol -90.

Settlement (2 transactions — optimal):
- Carol pays Ana $60
- Carol pays Bob $30
