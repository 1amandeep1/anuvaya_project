# Social Media App — Minimal Fullstack Demo

This repository is a small full-stack demo implementing a dark-mode social feed (feed, create post, login/register modals, post CRUD) based on a Figma design. It's built as a single Next.js app (frontend + API routes) and uses a local file-backed JSON store for persistence so you can run the project with zero DB setup.

## Quick overview

- Frontend: Next.js (pages router), React, TypeScript, Tailwind CSS
- Data fetching / caching: SWR
- Backend: Next.js API routes under `/api/v1`
- Persistence: file-backed JSON store at `data/db.json` (lib/store.ts)
- Auth: JWT tokens issued by the API and stored in `localStorage` for this demo
- Passwords: hashed with bcryptjs

  <img width="1423" height="822" alt="abc2" src="https://github.com/user-attachments/assets/3ae8a4be-aa4f-421b-9785-88da735f1aa8" />
  <img width="1437" height="842" alt="abc" src="https://github.com/user-attachments/assets/776321e8-e016-46f3-8487-0a3fa62958ec" />


## Why this stack

- Single repo (Next.js) keeps frontend and backend together for fast iteration and easy deployment.
- TypeScript end-to-end improves DX and catches errors early.
- Tailwind for fast, custom styling (no UI libraries used).
- File store is simple to run locally without DB setup; swap for a proper DB in production.

## What is implemented (requirements mapping)

- Exact screens & interactions: feed, create-post, login/register modals, empty / loading states implemented in UI.
- CRUD for posts: create, read (list + single), update, delete implemented and persisted to `data/db.json`.
- Auth: register & login endpoints that return JWT tokens; frontend stores token and username in `localStorage`.
- API versioning: all backend endpoints are under `/api/v1/`.
- TypeScript across frontend and backend code.
- Lint script available (`npm run lint`).

Notable gaps:

- Tests: There are no active test files in the repository right now. (I removed a tiny test earlier.) At least one minimal API integration test should be added to fully meet the "tests" requirement.
- Concurrency & durability: the file-backed store is fine for local demos but not safe for concurrent writes or production use.

If you'd like, I can add a minimal integration test that exercises register → login → create post.

## Setup (Windows PowerShell)

1. Install dependencies

```powershell
npm install
```

2. Copy example env (set JWT secret)

```powershell
copy .env.example .env
# Edit .env and set JWT_SECRET
```

3. Start dev server

```powershell
npm run dev
```

Open http://localhost:3000

If you change server-side code and see stale errors related to old builds, clear the Next cache and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## Scripts

- npm run dev — start development server
- npm run build — build for production
- npm run start — run production build
- npm run lint — run Next.js linter

## Environment variables

- `JWT_SECRET` — secret used to sign JWT tokens. If absent, a development default is used but you should set a secure secret in `.env`.

## API documentation (/api/v1)

Base URL: http://localhost:3000/api/v1

1) POST /auth/register
- Description: create a new user
- Body (JSON):

  {
    "email": "alice@example.com",
    "username": "alice",
    "password": "strongpassword"
  }

- Responses:
  - 201: { user: { id, email, username }, token }
  - 400: { error: 'Missing fields' | 'Password must be at least 8 characters and contain no spaces' }
  - 409: { error: 'Email or username already exists' }

2) POST /auth/login
- Description: log in with email or username and password
- Body (JSON):

  { "identifier": "alice@example.com", "password": "strongpassword" }

- Responses:
  - 200: { user: { id, email, username }, token }
  - 401: { error: 'Invalid credentials' }

3) GET /posts
- Description: list posts (descending by createdAt)
- Response: 200 JSON array of posts; each post includes `author: { id, username, email }` when available.

4) POST /posts
- Description: create a new post (authenticated)
- Headers: Authorization: Bearer <token>
- Body: { content: string }
- Responses:
  - 201: created post JSON (with author)
  - 401: { error: 'Unauthorized' }
  - 400: { error: 'Missing content' }

5) GET /posts/:id
6) PUT /posts/:id (auth, author only)
7) DELETE /posts/:id (auth, author only)

Example fetch (client-side):

```js
// create post
fetch('/api/v1/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ content: 'Hello world' })
})
```

## Where data is stored
Data is stored in `data/db.json` and managed by `lib/store.ts`. The store exposes functions used by the API routes. This approach is intentionally minimal for local demos.

## Known trade-offs & future improvements

- Persistence: move to SQLite/Postgres and ORM (Prisma/Knex/TypeORM) for production.
- Concurrency: add file locking or move to a DB to avoid race conditions when writing `data/db.json`.
- Security: use HTTP-only cookies for auth instead of JWT in localStorage.
- Tests: add integration tests for API routes (register/login/post flow) and unit tests for core logic.
- Pagination: add cursor-based pagination for the posts endpoint.

