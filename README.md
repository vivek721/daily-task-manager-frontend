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

**UI**
- Tabbed layout: Current Tasks, Old Tasks, History, Deleted
- Loading and error states, with a retry button when fetching tasks fails
- Light, dark and system theme toggle in the header (the choice is saved in `localStorage`)
- Animated transitions (Framer Motion), Lucide icons, and a responsive layout

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 5.8 |
| State | Redux Toolkit: one `tasks` slice with async thunks, plus memoized selectors built with `createSelector` |
| Auth state | React Context (`AuthContext`), with the JWT kept in `localStorage` |
| Data | `fetch`-based API client (`src/services/api.ts`) that talks to the Express backend at `VITE_API_URL` |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`, reusing `tailwind.config.js` through `@config`), class-based dark mode, component CSS files, `clsx` / `class-variance-authority` for UI primitives |
| Animation / icons | Framer Motion, lucide-react |
| Tooling | Vite 7, ESLint 9 (typescript-eslint, react-hooks) |
| CI | GitHub Actions: typecheck, lint and build on Node 20 and 22 |

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
├── config.ts               # API_URL / API_BASE_URL from VITE_API_URL
├── services/api.ts         # REST client (tasks and auth)
├── store/                  # store.ts, taskSlice.ts, selectors.ts, typed hooks
├── types/Task.ts
├── lib/utils.ts
├── App.tsx                 # Auth gate, header and tab layout
└── main.tsx                # Redux Provider, ThemeProvider and root render
```

## Getting started

### Prerequisites
- Node.js 20.19+ or 22.12+ (required by Vite 7) and npm
- A running copy of [daily-task-manager-backend](https://github.com/vivek721/daily-task-manager-backend). By default the app expects it on `http://localhost:3001` (see [Connecting to the backend](#connecting-to-the-backend) to change this). That repo documents its own PostgreSQL and Google OAuth setup. Set its `FRONTEND_URL` to `http://localhost:5173`: the backend uses it both for CORS and to send the Google OAuth redirect back to this app.

### Install and run

```bash
git clone https://github.com/vivek721/daily-task-manager-frontend.git
cd daily-task-manager-frontend
npm install
npm run dev          # http://localhost:5173
```

### Connecting to the backend

Every request to the backend (the task API, sign-up and sign-in, token checks, the "Sign in with Google" redirect and the dev-only test login) goes to one base URL, set in `src/config.ts`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3001` | Backend origin, without the `/api` suffix. Requests go to `${VITE_API_URL}/api/...`. |

If the backend runs on `http://localhost:3001`, you don't need an env file. To point the app at a different backend, copy `.env.example` to `.env.local` and set `VITE_API_URL`. Vite inlines the value at build time, so restart `npm run dev` or rebuild after you change it. The browser calls the backend directly (there is no dev proxy), so the backend's `FRONTEND_URL` must match the origin the app is served from.

### npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5173 |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check the app and config (`tsc -b`) |
| `npm run lint` / `npm run lint:fix` | Run ESLint, or run it and apply fixes |
| `npm run check-all` | Typecheck, lint and build |
| `npm run pre-commit` | Typecheck and lint |
| `npm run analyze` | Build, then open `vite-bundle-analyzer` |
| `npm run clean` | Remove `dist/` and the Vite cache |

## Testing

There are no automated tests yet. CI (`.github/workflows/`) runs type checking, linting and a production build on Node 20 and 22. Lint failures are non-blocking in the `ci-cd.yml` pipeline but fail the `ci.yml` workflow (see [Known issues](#known-issues)).

## Deployment

Set `VITE_API_URL` to the production backend origin when you build, because Vite bakes it into the bundle. On the backend, set `FRONTEND_URL` to the deployed frontend origin so CORS and the Google OAuth redirect work.

- **Docker**: a multi-stage build (Node 22 Alpine, served by nginx). Pass the backend address as a build argument: `docker build --build-arg VITE_API_URL=https://api.example.com -t daily-task-manager .`
- **Netlify / Vercel**: `netlify.toml` and `vercel.json` are included. Add `VITE_API_URL` as an environment variable in the project settings. Both files also proxy `/api/*` to the placeholder `http://your-backend-url.com`. The app does not use that proxy, because it calls `VITE_API_URL` directly. The SPA fallback to `index.html` in these files is still needed.

## Known issues

- `npm run lint` reports 24 errors: hooks called inside a `try` block in `App.tsx`, unused `catch` bindings in `taskSlice.ts`, a few `any` types, and the context files exporting hooks alongside components. Because of these errors, the `ci.yml` workflow fails at its lint step.
- The History and Deleted tabs are styled by `TaskHistory.css` and `DeletedTasks.css`. These files use CSS variables (`--text-primary`, `--card-bg`, …) that are defined only in `App.css`, which is never imported. Their dark styles also follow `prefers-color-scheme` rather than the theme toggle, so these two tabs don't match the rest of the app's theme.
- `preview-deploy.yml` installs with pnpm (`pnpm install --frozen-lockfile`), but the repo only has an npm `package-lock.json`, so preview deployments fail at the install step.

## Roadmap (not yet built)

- Editing an existing task from the UI (the `updateTask` thunk and `PUT /tasks/:id` endpoint already exist)
- Search and filtering by category
- A task statistics view (the `selectTaskStats` selector exists but is not shown anywhere)
- Unit and component tests
