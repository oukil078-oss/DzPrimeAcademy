"""
DZ Prime Academy 2026 - Iteration 3 backend tests.
Covers new-feature endpoints for this batch:
  - POST /api/sessions past-date guardrail (400)
  - POST /api/ambassadors admin-guarded create + returned tempPassword
  - DELETE /api/ambassadors/{id} admin-guarded remove
  - POST /api/sessions/{id}/register + POST /api/sessions/my-registrations (reminder-eligible session)
"""
import uuid
import pytest
import requests

BASE_URL = "https://prime-academy-dz.preview.emergentagent.com"
TIMEOUT = 30
ADMIN_EMAIL = "admin@dzprime.academy"
ADMIN_PASSWORD = "DzPrime2026Admin!"


def _s():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin():
    s = _s()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=TIMEOUT)
    if r.status_code != 200:
        pytest.skip(f"admin login failed: {r.status_code} {r.text}")
    return s


@pytest.fixture(scope="module")
def student():
    s = _s()
    suffix = uuid.uuid4().hex[:8]
    email = f"stud_it3_{suffix}@dzprime.test"
    r = s.post(
        f"{BASE_URL}/api/auth/register",
        json={"name": f"Stud {suffix}", "email": email, "password": "Test1234", "wilayaCode": 16, "wilayaName": "Alger"},
        timeout=TIMEOUT,
    )
    assert r.status_code == 201, r.text
    return s, r.json()["user"]


# ---------------- Session past-date guardrail ----------------
class TestSessionPastDateGuardrail:
    def test_reject_past_date(self, admin):
        payload = {
            "title": f"TEST_Past_{uuid.uuid4().hex[:6]}",
            "teacherName": "Pr. Past",
            "scheduledAt": "2020-01-01T10:00:00Z",
            "durationMinutes": 60,
            "platform": "GOOGLE_MEET",
            "meetUrl": "https://meet.google.com/past-test",
            "wilayaCode": 16,
            "category": "UNIVERSITY_LMD",
        }
        r = admin.post(f"{BASE_URL}/api/sessions", json=payload, timeout=TIMEOUT)
        assert r.status_code == 400, r.text
        data = r.json()
        assert "error" in data

    def test_accept_future_date(self, admin):
        payload = {
            "title": f"TEST_Future_{uuid.uuid4().hex[:6]}",
            "teacherName": "Pr. Future",
            "scheduledAt": "2030-01-01T10:00:00Z",
            "durationMinutes": 60,
            "platform": "GOOGLE_MEET",
            "meetUrl": "https://meet.google.com/future-test",
            "wilayaCode": 16,
            "category": "UNIVERSITY_LMD",
        }
        r = admin.post(f"{BASE_URL}/api/sessions", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        assert r.json()["title"] == payload["title"]

    def test_anonymous_rejected(self):
        s = _s()
        r = s.post(
            f"{BASE_URL}/api/sessions",
            json={"title": "x", "teacherName": "y", "scheduledAt": "2030-01-01T10:00:00Z"},
            timeout=TIMEOUT,
        )
        assert r.status_code in (401, 403)


# ---------------- Ambassador Add / Remove ----------------
class TestAmbassadorCRUD:
    def test_admin_add_and_remove_ambassador(self, admin):
        suffix = uuid.uuid4().hex[:6]
        email = f"amb_it3_{suffix}@dzprime.test"
        payload = {
            "email": email,
            "name": f"Amb {suffix}",
            "wilayaCode": 16,
            "wilayaNameAr": "الجزائر",
            "wilayaNameFr": "Alger",
            "institutionNameAr": "USTHB",
            "institutionNameFr": "USTHB",
            "specialtyName": "Physics",
            "phone": "+213500000000",
            "promoCode": f"AMB{suffix.upper()}",
        }
        r = admin.post(f"{BASE_URL}/api/ambassadors", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data.get("tempPassword"), f"Missing tempPassword: {data}"
        assert data["promoCode"] == payload["promoCode"]
        amb_id = data["id"]

        # verify in list
        r2 = admin.get(f"{BASE_URL}/api/ambassadors", timeout=TIMEOUT)
        assert r2.status_code == 200
        ids = [a["id"] for a in r2.json()]
        assert amb_id in ids

        # delete
        r3 = admin.delete(f"{BASE_URL}/api/ambassadors/{amb_id}", timeout=TIMEOUT)
        assert r3.status_code == 200, r3.text

        # verify removed
        r4 = admin.get(f"{BASE_URL}/api/ambassadors", timeout=TIMEOUT)
        ids2 = [a["id"] for a in r4.json()]
        assert amb_id not in ids2

    def test_delete_nonexistent(self, admin):
        r = admin.delete(f"{BASE_URL}/api/ambassadors/nonexistent-xyz-999", timeout=TIMEOUT)
        assert r.status_code == 404

    def test_anonymous_cannot_add(self):
        s = _s()
        r = s.post(
            f"{BASE_URL}/api/ambassadors",
            json={"email": "x@y.z", "name": "x", "wilayaCode": 16, "wilayaNameAr": "الجزائر", "institutionNameAr": "x"},
            timeout=TIMEOUT,
        )
        assert r.status_code in (401, 403)

    def test_anonymous_cannot_delete(self):
        s = _s()
        r = s.delete(f"{BASE_URL}/api/ambassadors/any-id", timeout=TIMEOUT)
        assert r.status_code in (401, 403)


# ---------------- Landing page + exams route ----------------
class TestPublicRoutes:
    def test_landing_ar_loads(self):
        r = requests.get(f"{BASE_URL}/ar", timeout=TIMEOUT)
        assert r.status_code == 200

    def test_exams_ar_loads(self):
        r = requests.get(f"{BASE_URL}/ar/exams", timeout=TIMEOUT)
        assert r.status_code == 200

    def test_dawarat_ar_loads(self):
        r = requests.get(f"{BASE_URL}/ar/dawarat", timeout=TIMEOUT)
        assert r.status_code == 200


# ---------------- Session reminder: near-future session + student register ----------------
class TestSessionReminderData:
    def test_create_soon_session_and_register(self, admin, student):
        # Create session ~15 minutes in future
        import datetime as dt
        soon = (dt.datetime.utcnow() + dt.timedelta(minutes=15)).strftime("%Y-%m-%dT%H:%M:%SZ")
        payload = {
            "title": f"TEST_Reminder_{uuid.uuid4().hex[:6]}",
            "teacherName": "Pr. Reminder",
            "scheduledAt": soon,
            "durationMinutes": 60,
            "platform": "GOOGLE_MEET",
            "meetUrl": "https://meet.google.com/reminder-test",
            "wilayaCode": 16,
            "category": "UNIVERSITY_LMD",
        }
        r = admin.post(f"{BASE_URL}/api/sessions", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        sid = r.json()["id"]

        stud_s, stud_user = student
        r2 = stud_s.post(f"{BASE_URL}/api/sessions/{sid}/register", timeout=TIMEOUT)
        assert r2.status_code == 201, r2.text

        r3 = stud_s.get(f"{BASE_URL}/api/sessions/my-registrations", timeout=TIMEOUT)
        assert r3.status_code == 200
        assert sid in r3.json()
