# Test Credentials — DZ Prime Academy 2026

Production database was reset on 2026-08-30. All demo/test student, teacher, and ambassador
accounts were removed. Only the OWNER admin account remains, plus reference/catalog data
(Wilayas, Institutions, Faculties, Modules, Exams, PlatformSettings, Bundles).

## Admin (OWNER)
- Email: admin@dzprime.academy
- Password: DzPrime2026Admin!

## Notes
- No student/teacher/ambassador test accounts exist anymore — create new ones via the
  public Register flow at `/{locale}` (landing page) as needed for testing.
- Real JWT email+password auth (bcrypt + jsonwebtoken), secrets in /app/frontend/.env
  (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).
