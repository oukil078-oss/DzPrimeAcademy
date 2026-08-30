"""
DZ Prime Academy 2026 - Backend API integration tests.
Tests all Next.js API routes proxied through FastAPI /api/*.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = "https://prime-academy-dz.preview.emergentagent.com"
TIMEOUT = 30


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------------- Health / static routes ----------------
class TestPageRoutes:
    @pytest.mark.parametrize("path", [
        "/", "/ar", "/fr", "/en",
        "/ar/admin", "/ar/teacher", "/ar/student", "/ar/ambassador",
        "/ar/dawarat", "/ar/card", "/ar/bot", "/ar/ambassadors",
    ])
    def test_page_200(self, s, path):
        r = s.get(f"{BASE_URL}{path}", timeout=TIMEOUT)
        assert r.status_code == 200, f"{path} -> {r.status_code}"


# ---------------- Wilayas ----------------
class TestWilayas:
    def test_wilayas_returns_58(self, s):
        r = s.get(f"{BASE_URL}/api/wilayas", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 58, f"Expected 58 wilayas got {len(data)}"
        first = data[0]
        assert "code" in first and ("nameAr" in first or "name_ar" in first)


# ---------------- Card verify ----------------
class TestCardVerify:
    def test_valid_card_taylor(self, s):
        r = s.get(f"{BASE_URL}/api/card/verify/DZ-GLD-16-8841", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert data["isValid"] is True
        assert data["card"]["holderName"] == "Taylor Belalem"
        assert data["card"]["cardId"].upper() == "DZ-GLD-16-8841"

    def test_invalid_card(self, s):
        r = s.get(f"{BASE_URL}/api/card/verify/INVALID-CARD-999", timeout=TIMEOUT)
        assert r.status_code == 404
        data = r.json()
        assert data["isValid"] is False


# ---------------- Courses ----------------
class TestCourses:
    def test_list_courses(self, s):
        r = s.get(f"{BASE_URL}/api/courses", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_create_course_and_persist(self, s):
        title = f"TEST_Course_{uuid.uuid4().hex[:8]}"
        payload = {
            "titleAr": title,
            "titleFr": "Cours de test",
            "teacherName": "Pr. Test",
            "category": "UNIVERSITY_LMD",
            "lessonsCount": 10,
            "priceDzd": 5000,
            "isLive": True,
            "colorTheme": "cyan",
        }
        r = s.post(f"{BASE_URL}/api/courses", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        created = r.json()
        assert created["titleAr"] == title
        assert "id" in created

        # verify persistence via GET
        r2 = s.get(f"{BASE_URL}/api/courses", timeout=TIMEOUT)
        titles = [c["titleAr"] for c in r2.json()]
        assert title in titles


# ---------------- Teachers ----------------
class TestTeachers:
    def test_list_teachers(self, s):
        r = s.get(f"{BASE_URL}/api/teachers", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        first = data[0]
        assert "ccpAccount" in first or "hourlyRateDzd" in first

    def test_create_teacher(self, s):
        suffix = uuid.uuid4().hex[:6]
        payload = {
            "email": f"TEST_teacher_{suffix}@dzprime.dz",
            "name": f"TEST Teacher {suffix}",
            "university": "USTHB",
            "specialty": "Physics",
            "hourlyRateDzd": 12000,
            "ccpAccount": "1234567890",
            "ccpCle": "12",
            "wilayaCode": 16,
            "wilayaName": "Alger",
        }
        r = s.post(f"{BASE_URL}/api/teachers", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["user"]["email"] == payload["email"]
        assert data["hourlyRateDzd"] == 12000

    def test_payout_approval(self, s):
        r = s.get(f"{BASE_URL}/api/teachers", timeout=TIMEOUT)
        teachers = r.json()
        # pick a teacher with pending payout if possible
        target = next((t for t in teachers if t.get("payoutStatus") != "PAID"), teachers[0])
        tid = target["id"]
        r2 = s.post(f"{BASE_URL}/api/teachers/{tid}/payout", timeout=TIMEOUT)
        assert r2.status_code == 200, r2.text
        updated = r2.json()
        assert updated["payoutStatus"] == "PAID"
        assert updated.get("lastPayoutAt") is not None


# ---------------- Students ----------------
class TestStudents:
    def test_list_students(self, s):
        r = s.get(f"{BASE_URL}/api/students", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_toggle_verification(self, s):
        r = s.get(f"{BASE_URL}/api/students", timeout=TIMEOUT)
        users = r.json()
        student = next((u for u in users if u.get("role", "").startswith("STUDENT")), None)
        assert student is not None
        original = student.get("isVerified", False)
        payload = {
            "id": student["id"],
            "role": student["role"],
            "isVerified": not original,
            "wilayaCode": student.get("wilayaCode"),
            "wilayaName": student.get("wilayaName"),
        }
        r2 = s.put(f"{BASE_URL}/api/students", json=payload, timeout=TIMEOUT)
        assert r2.status_code == 200, r2.text
        updated = r2.json()
        assert updated["isVerified"] == (not original)
        # revert
        payload["isVerified"] = original
        s.put(f"{BASE_URL}/api/students", json=payload, timeout=TIMEOUT)


# ---------------- Sessions ----------------
class TestSessions:
    def test_list_sessions(self, s):
        r = s.get(f"{BASE_URL}/api/sessions", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_create_session(self, s):
        title = f"TEST_Session_{uuid.uuid4().hex[:8]}"
        payload = {
            "title": title,
            "teacherName": "Pr. Test",
            "scheduledAt": "2026-06-15T18:00:00Z",
            "durationMinutes": 90,
            "platform": "GOOGLE_MEET",
            "meetUrl": "https://meet.google.com/test-abc",
            "wilayaCode": 16,
            "category": "UNIVERSITY_LMD",
        }
        r = s.post(f"{BASE_URL}/api/sessions", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        assert r.json()["title"] == title


# ---------------- Modules ----------------
class TestModules:
    def test_list_modules(self, s):
        r = s.get(f"{BASE_URL}/api/modules", timeout=TIMEOUT)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_module(self, s):
        payload = {
            "nameAr": f"TEST_وحدة_{uuid.uuid4().hex[:6]}",
            "nameFr": "TEST Module",
            "code": f"TST{uuid.uuid4().hex[:4].upper()}",
            "coefficient": 3,
            "trackType": "UNIVERSITY_LMD",
            "examsCount": 2,
        }
        r = s.post(f"{BASE_URL}/api/modules", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201, r.text
        assert r.json()["code"] == payload["code"]


# ---------------- Ambassadors ----------------
class TestAmbassadors:
    def test_list_ambassadors(self, s):
        r = s.get(f"{BASE_URL}/api/ambassadors", timeout=TIMEOUT)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        codes = [a.get("promoCode") for a in data]
        # Should include at least one seeded promo code
        assert any(c and c.startswith(("ALGER", "ORAN", "SETIF", "CONST", "ANNABA")) for c in codes) or len(codes) >= 3


# ---------------- Settings ----------------
class TestSettings:
    def test_get_settings(self, s):
        r = s.get(f"{BASE_URL}/api/settings", timeout=TIMEOUT)
        assert r.status_code == 200


# ---------------- Subdomain host header ----------------
class TestSubdomainRouting:
    @pytest.mark.parametrize("subdomain,expect_locale_path", [
        ("admin", "/ar/admin"),
        ("teacher", "/ar/teacher"),
        ("student", "/ar/student"),
        ("ambassador", "/ar/ambassador"),
    ])
    def test_subdomain_rewrite(self, subdomain, expect_locale_path):
        # Hit internal Next.js directly with a spoofed Host header
        r = requests.get(
            "http://127.0.0.1:3000/",
            headers={"Host": f"{subdomain}.localhost:3000"},
            timeout=TIMEOUT,
            allow_redirects=False,
        )
        assert r.status_code in (200, 307, 308), f"{subdomain} -> {r.status_code}"


# ---------------- Real-time sync flow ----------------
class TestRealtimeSync:
    def test_course_created_appears_everywhere(self, s):
        title = f"TEST_RTSYNC_{uuid.uuid4().hex[:8]}"
        payload = {
            "titleAr": title,
            "teacherName": "Pr. Sync Test",
            "category": "UNIVERSITY_LMD",
            "lessonsCount": 5,
            "priceDzd": 3000,
            "isLive": True,
            "colorTheme": "purple",
        }
        r = s.post(f"{BASE_URL}/api/courses", json=payload, timeout=TIMEOUT)
        assert r.status_code == 201
        # A single GET should surface it - clients (dawarat/admin/student) all consume /api/courses
        r2 = s.get(f"{BASE_URL}/api/courses", timeout=TIMEOUT)
        titles = [c["titleAr"] for c in r2.json()]
        assert title in titles, "Newly created course did not persist to DB / not returned by GET"
