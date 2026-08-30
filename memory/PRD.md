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

## Backlog / Not Yet Done (P1/P2)
- Ambassadors CRUD: only GET+PUT(verify) implemented; POST (add new ambassador) and DELETE not yet built for admin UI.
- Session POST has no server-side date validation.
- Course POST doesn't persist teacherId reliably when only teacherName passed from admin form (works fine from Teacher Studio where teacherId is set).
- GSAP ScrollTrigger entrance reveals not applied to landing page hero (only KPI counters use GSAP so far).
- Track-specific filtering (BAC/LMD/Medical) exists at data model level (category field) but is not yet enforced as a strict per-student visibility filter on catalog pages.
- Test data cleanup: TEST_/UITEST_ prefixed rows created during QA remain in Supabase (harmless demo noise).

## Test Credentials
No login/password — persona-switching demo app. See `/app/memory/test_credentials.md`.
