# Daily Task Manager (Frontend)

A single-page task manager built with React, TypeScript and Redux Toolkit, focused on the tasks you need to do today. Users sign in with a username and password or with Google. Tasks are stored on a REST API, not in the browser. The app splits tasks into today, other and old (past-due) lists. It has bulk actions for clearing out old tasks, a soft-delete bin with restore, and a change-history view for tasks.

Backend (Node.js, Express, TypeScript, PostgreSQL, Passport Google OAuth): [vivek721/daily-task-manager-backend](https://github.com/vivek721/daily-task-manager-backend)

## Features

**Authentication**
- Username/password sign-up and sign-in with client-side validation (username at least 3 characters, password at least 6, passwords must match)
- "Sign in with Google": the browser goes to the backend's `/api/auth/google` endpoint. After the OAuth handshake, the backend sends the user to `/auth/callback?token=<JWT>`, and the frontend stores the token.
- Every API request sends the JWT as a `Bearer` token. On startup the app checks the stored token against `/api/auth/verify`. A `401` response clears the token and sends the user back to the login screen.
- In development builds only, a "Dev Login (Test User)" button calls the backend's `/api/auth/dev-login`. The button is hidden in production builds.
- A user menu in the header shows the user's name, email and Google avatar, with a sign-out option.

**Tasks**
- Create a task with a title (required), description, priority (high/medium/low), due date and category
- Mark a task complete or not complete, and delete it (a soft delete on the server)
- **Today's Tasks** holds tasks created today or due today or later. **Other Tasks** holds everything that is neither today's nor old.
- Lists are sorted by status (open tasks first), then priority, then due date, then creation time
- Each list shows a completion counter, and tasks past their due date get an overdue flag

**Old tasks** (tasks that were due, or created without a due date, before today)
- Filter by incomplete or completed, or group by date
- Bulk actions, each with a confirmation prompt: complete all, delete completed, delete all

**Deleted tasks and history**
- The Deleted tab lists soft-deleted tasks with a countdown to their 24-hour expiry, and lets you restore a task or delete it permanently
- The History tab shows a log of task changes (created, updated, completed, deleted), filterable by task
- See [Known issues](#known-issues) about auth headers on these two tabs

**UI**
- Tabbed layout: Current Tasks, Old Tasks, History, Deleted
- Loading and error states, with a retry button when fetching tasks fails
- Animated transitions (Framer Motion), Lucide icons, and a responsive layout

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 5.8 |
| State | Redux Toolkit: one `tasks` slice with async thunks, plus memoized selectors built with `createSelector` |
| Auth state | React Context (`AuthContext`), with the JWT kept in `localStorage` |
| Data | `fetch`-based API client (`src/services/api.ts`) that talks to the Express backend |
| Styling | Tailwind CSS (via `@tailwindcss/postcss`), component CSS files, `clsx` / `class-variance-authority` for UI primitives |
| Animation / icons | Framer Motion, lucide-react |
| Tooling | Vite 7, ESLint 9 (typescript-eslint, react-hooks) |
| CI | GitHub Actions: typecheck, lint and build on Node 18/20/22 |

## Project structure

```
src/
├── components/
│   ├── ui/                 # Button, Card, Input, Badge, ThemeToggle
│   ├── LoginPage.tsx       # Switches between username/password and Google sign-in
│   ├── SignIn.tsx / SignUp.tsx
│   ├── GoogleLogin.tsx     # Redirects to the backend OAuth endpoint
│   ├── AuthCallback.tsx    # Reads ?token= from the OAuth redirect
│   ├── DevLogin.tsx        # Development-only test login
│   ├── TaskForm.tsx / TaskList.tsx / TaskItem.tsx
│   ├── OldTasks.tsx        # Past tasks and bulk actions
│   ├── DeletedTasks.tsx    # Restore or permanently delete
│   ├── TaskHistory.tsx     # Task change log
│   └── UserProfile.tsx
├── contexts/               # AuthContext, ThemeContext
├── services/api.ts         # REST client (tasks and auth)
├── store/                  # store.ts, taskSlice.ts, selectors.ts, typed hooks
├── types/Task.ts
├── lib/utils.ts
├── App.tsx                 # Auth gate, header and tab layout
└── main.tsx                # Redux Provider and root render
```

## Getting started

### Prerequisites
- Node.js 20.19+ (required by Vite 7) and npm
- A running copy of [daily-task-manager-backend](https://github.com/vivek721/daily-task-manager-backend) on `http://localhost:3001`. That repo documents its own PostgreSQL and Google OAuth setup. Set its `FRONTEND_URL` to `http://localhost:5173` so the Google OAuth redirect lands back on this app.

### Install and run

```bash
git clone https://github.com/vivek721/daily-task-manager-frontend.git
cd daily-task-manager-frontend
npm install
npm run dev          # http://localhost:5173
```

### Connecting to the backend

Most API calls go to the fixed address `http://localhost:3001/api`, so for local development the backend must run on port 3001. The main client, the auth context, and the History and Deleted tabs all use this address.

| Setting | Where | Purpose |
| --- | --- | --- |
| `VITE_API_URL` (optional, default `http://localhost:3001`) | `.env.local` | Backend origin for the "Sign in with Google" redirect. No other request reads it. |
| Vite dev proxy `/api` to `http://localhost:3001` | `vite.config.ts` | Used by the dev-only test login |

No `.env` file is needed for local development if the backend runs on port 3001.

### npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5173 |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run lint:fix` | Run ESLint, or run it and apply fixes |
| `npm run check-all` | Typecheck, lint and build |
| `npm run pre-commit` | Typecheck and lint |
| `npm run analyze` | Build, then open `vite-bundle-analyzer` |
| `npm run clean` | Remove `dist/` and the Vite cache |

## Testing

There are no automated tests yet. CI (`.github/workflows/`) runs type checking, linting and a production build. Lint failures in the `ci-cd.yml` pipeline are currently non-blocking.

## Deployment

The repo includes starting configurations for Docker (a multi-stage build served by nginx), Netlify (`netlify.toml`) and Vercel (`vercel.json`). The Netlify and Vercel files proxy `/api/*` to the placeholder `http://your-backend-url.com`, which has to be replaced with a real backend address. The API base URL is also hard-coded to `localhost` (see below), so a production deployment needs that address made configurable first.

## Known issues

- `ThemeToggle` in the header calls `useTheme()`, but `ThemeProvider` is never mounted in `main.tsx`/`App.tsx`. `useTheme()` throws when there is no provider, so the app needs to be wrapped in `ThemeProvider` before the light/dark/system toggle can work.
- The History and Deleted tabs call `fetch` directly without the `Authorization` header. The backend requires a token on every `/api/tasks/*` route, so these tabs will get `401` responses until they use the shared API client.
- The API base URL is hard-coded to `http://localhost:3001/api` in several files instead of being read from `VITE_API_URL`.

## Roadmap (not yet built)

- Editing an existing task from the UI (the `updateTask` thunk and `PUT /tasks/:id` endpoint already exist)
- Search and filtering by category
- A task statistics view (the `selectTaskStats` selector exists but is not shown anywhere)
- Unit and component tests
