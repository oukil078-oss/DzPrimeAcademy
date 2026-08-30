# Test Credentials — DZ Prime Academy 2026

No login/password required. This is a persona-switching demo app: the current user
persona is auto-hydrated based on the route/subdomain visited (see `hydrateDefaultPersonaForPath`
in `src/lib/store.ts`) and stored in `localStorage`.

## Demo Personas (DEMO_USERS array, index is load-bearing)
| Index | Name | Role | Route/Subdomain | Card ID |
|---|---|---|---|---|
| 0 | Riad Benmhidi | OWNER | /admin, admin.localhost:3000 | DZ-OWN-16-0001 |
| 1 | Nadia Amrani | ADMIN | (secondary admin, no dedicated route) | DZ-ADM-31-0002 |
| 2 | Alaa Eddine | AMBASSADOR | /ambassador, ambassador.localhost:3000 | DZ-AMB-16-0789 |
| 3 | Pr. Abdelrahim Kadri | TEACHER | /teacher, teacher.localhost:3000 | DZ-TCH-19-0142 |
| 4 | Yacine Belalem | STUDENT_FREE | (fallback free student) | DZ-STU-16-4412 |
| 5 | Taylor Belalem | STUDENT_PAID (Gold VIP) | /student, student.localhost:3000 | DZ-GLD-16-8841 |

To switch persona manually in-browser: clear `localStorage` key `dz_prime_current_user`
(or use the app's AuthModal) then revisit the desired route/subdomain.

## Database
Supabase Postgres (Session Pooler, ap-northeast-1). `DATABASE_URL` set in `/app/frontend/.env`.
Seed is idempotent (`ensureSeeded()` in `src/lib/seed.ts`), runs automatically on first API call.
