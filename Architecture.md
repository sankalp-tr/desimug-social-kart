# DesiMug Social Kart — Architecture

This document describes where this project is **headed**. It is the "north star" — not everything here exists yet. The [ROADMAP.md](./ROADMAP.md) tells you, phase by phase, when each piece gets built. Read this once now to see the big picture, then re-read each section when its Roadmap phase comes up.

Written for a beginner: every term is explained in plain words before any code/diagram.

---

## 1. What this app is

**DesiMug Social Kart** is a marketplace + social feed for Indian artisan goods:

- **Marketplace** — sellers list products (mugs, bags, clothing...), buyers browse and order them.
- **Social Feed** — users post updates ("just launched my new mug collection!"), others like/comment.
- **Users** have a **role**: `admin`, `seller`, or `buyer`. What you can do depends on your role (see RBAC, §5).

One app, two fairly independent "halves" (Marketplace, Feed). That split is exactly why this project is a good teaching example for **microfrontends** — see §3.

---

## 2. Target system diagram

Today, the picture is simple: one React app talks straight to one Express API.

```
[ React app (Vite) ]  --fetch /api/...-->  [ Express API ]  --mongoose-->  [ MongoDB ]
```

Where this is heading (microfrontend phase, Roadmap Phase 9+):

```
                         ┌─────────────────────────┐
                         │   Browser                │
                         └─────────────┬────────────┘
                                       │
                         ┌─────────────▼────────────┐
                         │   Shell App (the "frame") │   <- loads the others,
                         │   - top nav, layout       │      owns routing,
                         │   - auth session           │      hosts the commBus
                         └───┬───────────┬───────────┘
                             │           │
                 ┌───────────▼─┐     ┌───▼────────────┐
                 │ Marketplace  │     │ Social Feed     │   <- independently built,
                 │ Microfrontend│     │ Microfrontend   │      deployed, and owned
                 └───────┬──────┘     └────────┬────────┘
                         │                     │
                         └──────────┬──────────┘
                                    │  talk to the SAME backend
                         ┌──────────▼──────────┐
                         │   API Gateway         │   <- single front door,
                         │   (gateway/index.js)  │      routes requests
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Express REST API    │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   MongoDB              │
                         └───────────────────────┘
```

Key idea: the **Shell** is a thin frame. The **Marketplace** and **Feed** apps are built and could even be deployed separately. They never import each other's code directly — if they need to talk, they use the **commBus** (§4).

---

## 3. Microfrontend architecture, explained simply

A **microfrontend (MFE)** is the frontend equivalent of microservices: instead of one giant React app, you split it into smaller apps, each owned by (conceptually) a different team, each independently buildable and deployable.

- **Shell app** — the outer frame. Renders the navigation, decides which MFE to show for which route, and holds anything truly global (logged-in user, theme). Roughly: today's `src/App.tsx` is the seed of the future Shell.
- **Remote apps** — the Marketplace MFE and Feed MFE. Each is its own Vite project with its own `package.json`. They expose their pages; the Shell loads them at runtime.
- **How loading at runtime works**: a technique called **Module Federation** (a Vite/Webpack plugin) lets the Shell fetch a remote app's JS bundle over HTTP at runtime, as if it were a local import — `const Marketplace = await import('marketplace/App')`. No rebuild of the Shell needed when Marketplace ships a new version.
- **Why bother**: independent deploys (ship Feed without redeploying Marketplace), independent teams/repos at scale, smaller bundles per page. The cost: more moving parts, and you need a discipline for cross-app communication — which is exactly what the commBus solves.

This project starts as **one app** (today) and gets carved into Shell + Marketplace + Feed in Roadmap Phase 9, once the single-app version already works well. Splitting too early just adds pain with no payoff — that's a real lesson, not a shortcut.

---

## 4. commBus — cross-microfrontend communication

**The problem**: once Marketplace and Feed are separate apps with separate builds, Marketplace's code literally cannot `import` anything from Feed (different bundle, maybe different deploy). But sometimes they still need to tell each other things — e.g., user adds a product to cart in Marketplace, and the Shell's cart-count badge (always visible) needs to update.

**The anti-pattern**: reaching into another MFE's internals, or having the Shell poll each MFE's state. Tightly couples apps that are supposed to be independent.

**The pattern — commBus**: a tiny, framework-agnostic publish/subscribe channel that any MFE (or the Shell) can publish events to, and any MFE can subscribe to, without knowing who's on the other end. Think of it as a shared "announcement board."

A minimal implementation (what Roadmap Phase 10 builds) is just the browser's built-in `CustomEvent` on `window` — no library needed:

```ts
// commBus.ts — lives in a tiny shared package all MFEs import
export const commBus = {
  publish<T>(event: string, detail: T) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },
  subscribe<T>(event: string, handler: (detail: T) => void) {
    const listener = (e: Event) => handler((e as CustomEvent<T>).detail);
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener); // cleanup
  },
};
```

Example contract — Marketplace publishes, Shell subscribes:

```ts
// Inside Marketplace MFE, after a successful "add to cart":
commBus.publish('cart:item-added', { productId, quantity: 1 });

// Inside Shell, in the cart badge component:
useEffect(() => commBus.subscribe('cart:item-added', () => setCount(c => c + 1)), []);
```

**Rules of the road** (so it doesn't turn back into tight coupling):
1. Event names and their payload shape are a **contract** — write them down (Roadmap Phase 10 adds an `events.md` listing every event, like a mini API spec for events).
2. An MFE may publish events about *itself* and subscribe to events from *others* — but never assume who is listening or reach into another MFE's code.
3. Keep payloads small and serializable (IDs, not whole objects) — same spirit as REST API design.

---

## 5. RBAC — Role-Based Access Control

**The problem**: not every user should be able to do everything. A `buyer` shouldn't delete someone else's product listing; only an `admin` should see every user's data.

**The model** (already exists today in `server/models/User.js`): every user has a `role` field — `admin`, `seller`, or `buyer`.

**Where RBAC is enforced — in two places, and the backend rule is the one that actually matters**:

| Layer | What it does | Why it's not enough alone |
|---|---|---|
| **Backend (Express middleware)** | Reads the logged-in user's role from their auth token, rejects the request (`403 Forbidden`) if their role can't do this action | This is the *real* security boundary — a backend check can't be bypassed by editing frontend code |
| **Frontend (route guards / conditional UI)** | Hides buttons/pages the user's role can't use, redirects away from forbidden routes | Pure UX — makes the app pleasant to use, but a determined user could still call the API directly, which is why the backend check above is mandatory |

Example permission matrix (Roadmap Phase 3 builds the real version):

| Action | admin | seller | buyer |
|---|---|---|---|
| View products | ✅ | ✅ | ✅ |
| Create/edit own product | ✅ | ✅ | ❌ |
| Edit *any* product | ✅ | ❌ | ❌ |
| Place an order | ✅ | ✅ | ✅ |
| View all users | ✅ | ❌ | ❌ |

Backend shape (built in Phase 3 once login/JWT exists):

```js
// middleware/requireRole.js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// usage in a route file:
router.delete('/:id', requireAuth, requireRole('admin', 'seller'), deleteProduct);
```

Frontend shape (Context-based, built in Phase 4):

```tsx
// Hides the "Delete" button entirely for roles that can't use it —
// but the backend route above is still what actually blocks the request.
{ ['admin', 'seller'].includes(user.role) && <button onClick={onDelete}>Delete</button> }
```

---

## 6. REST API conventions + Swagger

The backend already follows standard REST conventions per resource (`/api/products`):

| Method | Path | Meaning |
|---|---|---|
| GET | `/api/products` | list (optionally filtered, e.g. `?category=Mugs`) |
| GET | `/api/products/:id` | one item |
| POST | `/api/products` | create |
| PUT | `/api/products/:id` | update |
| DELETE | `/api/products/:id` | delete |

**Swagger / OpenAPI** is a spec format for describing a REST API (every endpoint, its inputs, its possible responses) in a machine-readable way, plus a UI that renders that spec as interactive, clickable documentation — and lets you fire test requests from the browser without writing any frontend code. We document the API by writing structured comments (`@swagger` JSDoc blocks) directly above each route handler, so the docs can never drift far from the real code. Once Phase 1 is done, visiting `/api-docs` shows live docs for every resource.

This matters beyond "documentation": once microfrontends exist (§3), the OpenAPI spec is the one shared contract every MFE codes against, even though they're built independently.

---

## 7. State management ladder

Different kinds of state call for different tools. This project deliberately uses **all of them**, in different places, so you learn when to reach for which (the empty `src/context`, `src/redux`, `src/zustandStore` folders are reserved for this):

| Tool | Used for | Example in this app | Roadmap phase |
|---|---|---|---|
| `useState` (local) | State only one component cares about | Form inputs, a loading flag | Phase 1 (now) |
| **Context API** | App-wide *but rarely-changing* values, no complex update logic | Logged-in user, light/dark theme | Phase 4 |
| **Redux Toolkit** | App-wide state that changes often, from many places, needs predictable updates/devtools | Shopping cart, order history | Phase 5 |
| **Zustand** | Like Redux, but for state that's lightweight/local-ish and you want less boilerplate | UI-only state (e.g. a notification toast queue) | Phase 6 |

Rule of thumb you'll internalize by Phase 6: start with `useState`. Reach for Context only when prop-drilling truly hurts and updates are simple. Reach for Redux/Zustand when state is shared across distant components *and* changes frequently enough that Context's re-render behavior becomes a problem.

---

## 8. Target folder structure (post-microfrontend split)

```
desimug-social-kart/
├── shell/                  # Shell app — nav, routing, owns commBus, auth session
├── apps/
│   ├── marketplace/        # Marketplace MFE (today's Market.tsx grows into this)
│   └── feed/                # Social Feed MFE (today's MyFeed.tsx grows into this)
├── packages/
│   ├── comm-bus/            # shared publish/subscribe contract (§4)
│   └── ui-kit/              # shared buttons/inputs, so all MFEs look consistent
├── gateway/                  # API gateway — single entry point, routes to services
├── server/                   # Express REST API + MongoDB
└── docs/
    └── events.md             # commBus event contract registry
```

Today, everything still lives under one `src/`. This table is what `src/pages/Market.tsx` and `src/pages/MyFeed.tsx` eventually become.

---

## 9. CI/CD pipeline outline (Roadmap Phase 11)

**CI (Continuous Integration)** = automatically run checks (lint, type-check, tests, build) on every push/PR, so broken code never reaches `main`. **CD (Continuous Deployment)** = automatically ship a build that passes CI.

Planned GitHub Actions pipeline:

```
on: push / pull_request
  1. Install deps (npm ci)
  2. Lint (eslint)
  3. Type-check (tsc --noEmit)
  4. Unit tests (frontend: Jest/RTL, backend: Jest/Supertest)
  5. Build (vite build for each app, once microfrontends exist)
  6. (main branch only) Deploy: backend → a Node host, frontend(s) → static hosting
```

Each microfrontend gets its **own** pipeline once split out, so Marketplace can ship without waiting on Feed.

---

## 10. Tech stack summary

| Layer | Technology | Why |
|---|---|---|
| Frontend framework | React 18 + TypeScript | Industry standard, type safety |
| Build tool | Vite | Fast dev server, simple config |
| Routing | React Router | Client-side routing |
| Local/simple state | `useState`, Context API | Built into React, no dependency |
| Shared/complex state | Redux Toolkit, Zustand | Predictable, scalable state for bigger apps |
| Forms + validation | react-hook-form + zod | Standard pairing; zod also validates on the backend |
| Styling | CSS → SCSS (Phase 7) | SCSS adds variables/nesting on top of plain CSS |
| Backend framework | Express | Minimal, ubiquitous Node web framework |
| Database | MongoDB + Mongoose | Document DB fits flexible product/post shapes; Mongoose adds schema/validation |
| API docs | Swagger / OpenAPI | Self-documenting, testable API contract |
| Auth | JWT | Stateless tokens carrying the user's role for RBAC |
| Microfrontends | Vite Module Federation | Runtime composition of independently-built apps |
| Cross-MFE messaging | commBus (CustomEvent-based pub/sub) | Decoupled communication without shared imports |
| CI/CD | GitHub Actions | Free, tightly integrated with GitHub repos |

See [ROADMAP.md](./ROADMAP.md) for the order in which all of this gets built.
