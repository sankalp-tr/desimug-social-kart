# Learning Roadmap — DesiMug Social Kart

A phased path from "knows basic React/JS/HTML/CSS" to "can build and explain a production-style MERN microfrontend system" — using this one repo as the running example. Read [Architecture.md](./Architecture.md) first for *what* we're building toward; this doc is *the order* we build it in.

Work top to bottom. Don't skip ahead — later phases assume earlier ones are solid, on purpose (e.g. you shouldn't learn Redux before you've felt *why* plain `useState` becomes painful).

Each phase has a goal, what you'll learn, what gets built in this repo, and a check for "am I actually done."

---

### Phase 0 — Orientation ✅ (do this first, today)
- **Goal**: get the existing app running and see all the moving pieces.
- **Learn**: how a frontend dev server, a backend API server, and a cloud database relate to each other.
- **Do**: run `cd server && npm install && npm run dev` (backend on :5000) and `npm install && npm run dev` (frontend on :5173, separate terminal). Open `/api-docs` once Phase 1 adds it.
- **Done when**: both servers run without errors, and you can explain in one sentence what each of the three pieces (React app, Express server, MongoDB) does.

### Phase 1 — React talks to Node/Mongo (🚧 today)
- **Goal**: prove the full chain — browser click → React `fetch` → Express route → Mongoose query → MongoDB → back to the screen.
- **Learn**: REST verbs (GET/POST/PUT/DELETE), `fetch`, `useState`/`useEffect` for server data, what Swagger is for.
- **Build**: full CRUD UI for Products on the Market page (list/add/edit/delete), Swagger docs for all 4 resources at `/api-docs`.
- **Done when**: you can add a product in the browser, see it in MongoDB Atlas (or via Swagger's "Try it out"), edit it, delete it — entirely without touching the backend code.

### Phase 2 — TypeScript depth + real forms
- **Goal**: stop writing forms by hand; use the libraries already sitting unused in `package.json` (`react-hook-form`, `zod`).
- **Learn**: TS interfaces/types for API data, generics basics, schema validation, why validating on *both* frontend and backend matters (frontend = good UX, backend = the real guarantee).
- **Build**: replace the plain `<form>` from Phase 1 with `react-hook-form` + a `zod` schema (`src/schemas/`) for the product form; show inline validation errors.
- **Done when**: submitting an invalid product (e.g. negative price) shows an error without hitting the network, and TypeScript flags a typo'd field name at compile time.

### Phase 3 — Auth & RBAC basics
- **Goal**: real login, and the first half of RBAC (see [Architecture.md §5](./Architecture.md#5-rbac--role-based-access-control)).
- **Learn**: password hashing (`bcryptjs`, already a backend dependency), JWTs, Express middleware, protected routes in React Router.
- **Build**: `POST /api/users/login` issuing a JWT with the user's role; a `requireAuth`/`requireRole` Express middleware; a login page; React Router guards that redirect logged-out users.
- **Done when**: logging in as a `buyer` and trying to delete a product you don't own returns `403` from the *backend*, even if you bypass the frontend.

### Phase 4 — Context API
- **Goal**: first taste of app-wide state with React's built-in tool.
- **Learn**: when Context fits (infrequent updates, app-wide) and its limits (re-renders everything subscribed on any change).
- **Build**: fill in `src/context/AuthContext.tsx` (logged-in user from Phase 3) and `ThemeContext.tsx` (light/dark mode) for real.
- **Done when**: toggling theme or logging in/out updates the whole app without prop-drilling, and you can explain why Context would get awkward for something that updates 10x/second.

### Phase 5 — Redux Toolkit
- **Goal**: feel the difference Context's limits hit — shared state that changes a lot, from many places.
- **Learn**: store/slice/reducer/action vocabulary, `createSlice`, `useSelector`/`useDispatch`, Redux DevTools.
- **Build**: fill in `src/redux/**` for a shopping cart (add/remove/update quantity) and order history.
- **Done when**: you can trace, in Redux DevTools, every action that changed the cart, in order — and explain why that's harder with Context.

### Phase 6 — Zustand
- **Goal**: see a lighter-weight alternative to Redux for state that doesn't need the full ceremony.
- **Learn**: Zustand's store-as-a-hook pattern, when it's a better fit than Redux (less app-wide, less need for time-travel debugging).
- **Build**: fill in `src/zustandStore/**` for something genuinely lightweight — e.g. a toast/notification queue.
- **Done when**: you can articulate, for a new feature, which of useState/Context/Redux/Zustand you'd reach for and why.

### Phase 7 — Styling: SCSS
- **Goal**: move past plain CSS files.
- **Learn**: SCSS variables, nesting, mixins; CSS Modules for component-scoped styles.
- **Build**: convert `index.css` and per-page styles to `.module.scss`, introduce a shared `_variables.scss` (colors, spacing) used across pages.
- **Done when**: changing one variable (e.g. primary color) updates it everywhere it's used, with no class-name collisions between components.

### Phase 8 — Testing
- **Goal**: confidence that changes don't silently break things.
- **Learn**: unit vs integration tests, Jest + React Testing Library for components, Supertest for API routes.
- **Build**: tests for the Products CRUD UI (renders list, submits form) and the Products API routes (each verb, happy path + 404 case).
- **Done when**: `npm test` runs both suites and a deliberately-introduced bug (e.g. break the delete route) makes a test fail.

### Phase 9 — Microfrontend split
- **Goal**: turn the single app into Shell + Marketplace MFE + Feed MFE (see [Architecture.md §3](./Architecture.md#3-microfrontend-architecture-explained-simply)).
- **Learn**: Module Federation, runtime composition, independent builds/deploys.
- **Build**: `shell/` (nav + routing + auth, today's `App.tsx` grows into this), `apps/marketplace/` (today's `Market.tsx`), `apps/feed/` (today's `MyFeed.tsx`), wired through `gateway/`.
- **Done when**: you can run and deploy the Marketplace app on its own, and the Shell loads it at runtime without a Shell rebuild.

### Phase 10 — commBus
- **Goal**: real cross-MFE communication without coupling (see [Architecture.md §4](./Architecture.md#4-commbus--cross-microfrontend-communication)).
- **Learn**: pub/sub pattern, event-contract discipline.
- **Build**: `packages/comm-bus/`, `docs/events.md` registry, and a real event — e.g. Marketplace publishes `cart:item-added`, Shell's nav badge subscribes and updates.
- **Done when**: adding a product to cart in Marketplace updates the Shell's badge with zero direct import between the two apps.

### Phase 11 — CI/CD
- **Goal**: automate the checks you've been running by hand.
- **Learn**: GitHub Actions YAML, running lint/type-check/test/build on every push.
- **Build**: `.github/workflows/ci.yml` per app (see [Architecture.md §9](./Architecture.md#9-cicd-pipeline-outline-roadmap-phase-11)).
- **Done when**: pushing a commit that fails a test blocks the PR automatically, and a passing `main` commit triggers a build.

### Phase 12 — Deployment
- **Goal**: a real, working URL.
- **Learn**: deploying a Node API (e.g. Render/Railway), static hosting for frontends (e.g. Vercel/Netlify), environment variables in production.
- **Build**: deployed backend + Shell + each MFE, with production `MONGO_URI`/CORS config.
- **Done when**: you can send someone a link and they can actually use the app.

---

## How to use this with your mentor (me)

Start each session by saying which phase you're on. I'll keep edits scoped to that phase only — no jumping ahead to Redux while we're still on Phase 1, even if it'd be "more correct." The whole point is to feel *why* each tool gets introduced when it does.
