# AGENTS.md

## Cursor Cloud specific instructions

This is **Proyecto PostBL** — a React SPA blog platform (Spanish UI) built with Vite, TypeScript, and Tailwind CSS.

### Services

| Service | How to run | Notes |
|---|---|---|
| Vite dev server | `npm run dev` | Serves on `http://localhost:5173` |
| External backend API | N/A (remote) | `https://d3s0s6l3k7lw3s.cloudfront.net` — configured in `.env` via `VITE_API_BLOG` |

There is **no local backend or database**. All data operations go through the remote CloudFront API.

### Commands

Standard commands from `package.json`:

- **Lint:** `npm run lint` — runs ESLint. The codebase has pre-existing lint errors (mostly `@typescript-eslint/no-explicit-any`); these are not regressions.
- **Build:** `npm run build` — runs `tsc -b && vite build`. Produces output in `dist/`.
- **Dev:** `npm run dev` — starts Vite dev server. Add `-- --host 0.0.0.0` for network access.
- **Preview:** `npm run preview` — preview production build.

### Gotchas

- The external API at CloudFront may be intermittently unavailable. When it is down, login/registration/CRUD operations will fail, but the frontend UI still loads and renders correctly with client-side validation.
- No automated test suite exists (no `test` script in `package.json`). Validation is done via lint, build, and manual testing.
- The app uses `localStorage` for JWT token storage and draft post caching — some functionality degrades gracefully when the API is unreachable.
