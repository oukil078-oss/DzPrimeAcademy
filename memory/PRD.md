# DZ Prime Academy 2026 — PRD

## Original Problem Statement
Build a world-class, production-ready, multi-tenant EdTech/Fintech platform for Algeria on top of an existing Next.js 15 repo, matching two reference UI systems:
1. Eduplex (student/public) - dark sidebar, lime/gold pills, activity charts, schedule, calendar, progress rings.
2. Obsidian Luxury Fintech (admin) - dark command center, segmented nav, KPI decks, payroll/CCP ledgers, ambassador commissions.

Full spec covered: subdomain multi-tenant middleware (admin./teacher./student./ambassador.), trilingual AR/FR/EN + RTL, light/dark theme, real-time cross-dashboard sync of courses/sessions, track-specific filtering (BAC/LMD/Medical), role-specific sidebars, 4-tab Settings Modal, 5 admin CRUD hubs, GSAP+Framer Motion animations.

## User Choices (confirmed via ask_human)
- Build everything at once (not phased).
- Payments (BaridiMob/EDAHABIA): UI-only mock toggles, no real gateway.
- GSAP + ScrollTrigger added as dependency.
- REAL Supabase PostgreSQL persistence via Prisma (not localStorage-only) with idempotent auto-seed.
- All other data (Meet links, CCP numbers) = realistic mock data, no other 3rd-party integrations.

## Architecture
- Repo restructured: Next.js 15 app moved to `/app/frontend` (was at `/app` root). `/app/backend` is a minimal FastAPI reverse-proxy (`server.py`) forwarding all `/api/*` requests to the Next.js server on `127.0.0.1:3000`, so ingress `/api` routing to port 8001 reaches the real Next.js route handlers.
- DB: Supabase Postgres via Session Pooler (`aws-0-ap-northeast-1.pooler.supabase.com:5432`), `DATABASE_URL` in `/app/frontend/.env`. Direct connection (`db.*.supabase.co:5432`) is IPv6-only and unreachable from this sandbox — pooler used instead.
- Prisma schema (`prisma/schema.prisma`): User, Wilaya(58), Institution, Faculty, Specialty, AcademicYear, Module, Exam, AmbassadorProfile, Rating, Post, PostComment, Subscription, TeacherProfile, FacultyPayout, Course, LiveSession, Enrollment, PlatformSettings.
- Auto-seed (`src/lib/seed.ts`, called via `ensureSeeded()` at top of API GETs, idempotent via Wilaya-count guard): 58 wilayas, 6 demo users, 7 ambassador profiles w/ promo codes, 4 teacher payroll profiles, 5 courses, 4 live sessions, 2 enrollments, platform settings.
- `src/middleware.ts`: subdomain Host-header rewriting (admin./teacher./student./ambassador. → `/{locale}/{role}`) + locale-cookie-based default locale prefixing. Direct fallback paths (`/ar/admin` etc.) also work without DNS.
- `src/lib/store.ts` (`useAuthStore`): DEMO_USERS[0]=Riad Benmhidi(OWNER), [2]=Alaa Eddine(AMBASSADOR), [3]=Pr. Abdelrahim Kadri(TEACHER), [5]=Taylor Belalem(STUDENT_PAID, card DZ-GLD-16-8841). `hydrateDefaultPersonaForPath()` auto-sets persona based on route if no currentUser.
- `src/lib/platformStore.ts` (`usePlatformStore`): singleton courses/sessions store using `useSyncExternalStore`, backed by real Postgres via `/api/courses` & `/api/sessions`, optimistic updates + localStorage cache for instant cross-component reactivity.

## What's Been Implemented (2026-08-30)
- Full DB restructure + Supabase Postgres wiring + auto-seed, verified via psql query counts.
- Subdomain middleware + fallback paths, all return 200 (verified via curl with Host headers).
- Role-specific `AppSidebar` (Admin/Teacher/Student/Ambassador nav sets per spec section 4).
- `SettingsModal` (4 tabs: Profile, Preferences, System Admin [admin-only], Security).
- Admin Financial Command Center (`/admin`): segmented top nav (6 tabs, hash-routed), KPI deck matching spec numbers exactly (4.85M/1.42M/1.791M/895K DZD) with GSAP `AnimatedCounter`, Faculty Payroll+CCP ledger w/ one-click payout approval, Students tab (search/wilaya/tier filter + verify toggle), Sessions CRUD, Ambassadors commission ledger (promo codes), Courses+Curriculum Modules CRUD.
- Student Eduplex Dashboard (`/student`): greeting banner, New Courses grid, Go Premium/Gold VIP banner, Hours Activity bar chart, Daily Schedule (real sessions), Mini Calendar (session dots), Active Courses Progress (circular %, real enrollments), Assignments list.
- Teacher Studio (`/teacher`): course creation (`+ إضافة مقرر جديد`) and session scheduling wired to real-time store.
- Public Dawarat catalog (`/dawarat`) reflecting live courses instantly.
- 58 full wilayas (AR/FR/EN names + region) seeded and used in selectors.
- Full API layer: `/api/courses`, `/api/sessions`, `/api/teachers[/[id]/payout]`, `/api/students`, `/api/ambassadors`, `/api/modules`, `/api/settings`, `/api/enrollments`, `/api/card/verify/[id]`, `/api/wilayas`.
- `npx tsc --noEmit` = 0 errors. `npm run build` = success, all routes compile.
- Testing agent: 33/33 backend pytest tests pass, all frontend flows pass (real-time sync, personas, KPIs, settings modal, i18n switch, payout approval), zero console errors.

## What's Been Implemented (2026-08-30, continued session — Real Auth + Live Sessions)
- **CRITICAL FIX**: `useSyncExternalStore` `getSnapshot()` in `src/lib/store.ts` was returning a new object literal on every call, causing an infinite render loop (React error #185) that crashed the ENTIRE app with a white screen immediately after any login/register. Fixed by caching a module-level `snapshot` reference, only recomputed in `notify()`. Also hardened `getServerSnapshot()` in both `store.ts` and `platformStore.ts` to return stable const references. This was app-breaking and is now fully verified fixed (register, login, logout, re-login all tested with no crash).
- Discovered the app runs in **production mode** (`next start` via supervisor), not dev mode — new/changed API route files require `yarn build && sudo supervisorctl restart frontend` to take effect; hot reload alone is insufficient for backend route changes.
- Real JWT auth (`src/lib/auth.ts`, `/api/auth/*`) confirmed fully working: register (public, creates STUDENT_FREE), login, logout, `/api/auth/me`, admin-only teacher creation with generated temp password, brute-force lockout.
- New real-time live session enrollment flow: `POST/DELETE /api/sessions/[id]/register`, `GET /api/sessions/my-registrations`, `GET /api/teacher/roster`. New `LiveSessionsPanel.tsx` (student workshops tab — register/unregister toggle) and `TeacherRosterPanel.tsx` (teacher roster tab). Teacher `/teacher#sessions` tab now has a session-scheduling form. Full loop verified: teacher creates session → student registers → teacher roster shows student.
- `/verify/[cardId]` page rewritten to call the real `/api/card/verify/[id]` endpoint instead of an empty `DEMO_USERS` mock array (which always fell back to fake data).
- Removed dead `switchRole` mock-persona banner from ambassador dashboard (was a TS build error after mock auth removal).
- Digital membership card and mobile responsiveness (hamburger + drawer sidebar) verified already in good shape — no layout bugs found this session.

## Backlog / Not Yet Done (P1/P2)
- Postgres/Supabase is the sole datastore (external, not Emergent-managed). deployment_agent flagged this as an architecture note: confirm the Supabase project stays reachable/billed independently before relying on Emergent's deploy for persistence.
- Bundle purchase flow is a MOCKED/simulated checkout (paymentStatus='MOCK_SUCCESS', no real Stripe call yet) — user explicitly asked for this as a placeholder; real Stripe wiring is a future task.
- Ambassador dashboard (`AMBASSADORS`, `CERTIFIED_TEACHERS`, `RECENT_POSTS`) and student "workshops" ambassador-posts list are still static mock arrays from `initial-data.ts`, not DB-backed.
- `logout` route emits a comma-joined Set-Cookie header (works fine in browsers, cosmetic issue for non-browser HTTP clients).

## What's Been Implemented (2026-08-30, session 3 — Landing Page Rebuild + Backlog + Bug Fixes)
- New public marketing landing page at `/{locale}` (guest-only; logged-in users auto-redirect to their role dashboard via `getDashboardPath()` in `src/lib/rbac.ts`, also used by AuthModal post-login/register). Sections: hero (GSAP entrance), gold "competitive advantage" callout, 3 real DB-backed exam Bundles (BAC Sciences/BAC Languages/LMD MI-ST) with a MOCK/simulated checkout modal (`MockCheckoutModal.tsx` — clearly labeled "Demo Mode", no real payment), 3-steps section, membership card teaser, 58-wilaya ambassador network marquee, final CTA. All new landing components under `src/components/landing/`.
- New `Bundle`/`BundlePurchase` Prisma models + `/api/bundles` (GET/POST), `/api/bundles/[id]` (PUT/DELETE), `/api/bundles/[id]/purchase` (POST, mock). New admin `BundlesTab.tsx` (CRUD) wired into `/admin#bundles`.
- Ambassador CRUD completed: `POST /api/ambassadors` (already existed) + new `DELETE /api/ambassadors/[id]`; `AmbassadorsTab.tsx` now has an add-form + delete button + shows generated temp password.
- Session date guardrails: `POST /api/sessions` rejects past `scheduledAt` (400 + Arabic error); admin `SessionsTab.tsx` and Teacher Studio session form both get `min` datetime + inline error display; `platformStore.addSession()` now returns `{success, error}` and rolls back the optimistic row on failure.
- Course teacherId bug fixed: `POST /api/courses` now resolves `teacherId` by matching `teacherName` to an existing TEACHER user when not explicitly provided.
- Track-locked catalog: students with a `track` set now get `/dawarat` and the exam bank (`QuickStudyHub`'s `initialTrack` prop, now actually wired) auto-locked to their track (manual filter hidden, badge shown instead); guests/no-track students keep the manual filter. `/dawarat` also supports `?track=` query param.
- Live Session Reminders: new `SessionReminderBanner.tsx`, shown to logged-in students app-wide when a registered session starts within 60 min or is live, with join/dismiss actions.
- Relocated the old root-page exam-bank+governance tabs (previously shown to everyone at `/`) to a new public `/exams` page; added a sidebar nav link for students.
- Google login button removed from AuthModal (JWT-only, per earlier decision).
- **Bug fixes (reported by user via phone testing, both verified by testing_agent iteration_4)**: (1) Digital membership card 3D flip showed mirrored/garbled text on iOS Safari — fixed by moving flip-card CSS to `globals.css` classes with explicit `-webkit-` prefixes (`.card-flip-scene/.card-flip-inner/.card-face/.card-face-back`). (2) Mobile hamburger menu did nothing for guests — `AppSidebar` (which owns the mobile drawer) only mounts for logged-in users, so the toggle button in `Navbar.tsx` is now conditionally rendered only when `currentUser` exists.
- Production DB reset (`/app/frontend/scripts/reset-production-db.cjs`, one-off, not idempotent-loop-safe): wiped all demo/test student/teacher/ambassador accounts and their sessions/courses/enrollments/purchases; preserved the OWNER admin account, Wilayas/Institutions/Faculties/Modules/Exams/PlatformSettings, and the 3 seeded Bundles. Added root `.gitignore` (excludes `memory/test_credentials.md`, `node_modules/`, `.next/`).
- `deployment_agent` scan: 0 hardcoded secrets, correct ports/supervisor config, idempotent seed logic confirmed non-destructive. One architecture note (not a code bug): app depends entirely on external Supabase Postgres, not Emergent-managed MongoDB — flagged for user awareness only.

## Test Credentials
Real JWT auth — see `/app/memory/test_credentials.md`. Only account remaining after the 2026-08-30 DB reset: admin@dzprime.academy / DzPrime2026Admin! (OWNER). Register new accounts via the public flow as needed.
