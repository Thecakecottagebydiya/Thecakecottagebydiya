"""Backend sanity tests after pymongo/motor/fastapi/pydantic upgrade."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
ADMIN_EMAIL = "diya@thecakecottage.in"
ADMIN_PASSWORD = "Diya@Cakes2025"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    tok = data.get("access_token") or data.get("token")
    assert tok, f"no token in response: {data}"
    return tok


# Root health endpoint
def test_root(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    d = r.json()
    assert d.get("app") == "The Cake Cottage By Diya"
    assert d.get("status") == "ok"


# Cakes listing - verifies MongoDB read after motor upgrade
def test_cakes_list(api):
    r = api.get(f"{BASE_URL}/api/cakes")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 3, f"expected >=3 seeded cakes, got {len(data)}"
    c = data[0]
    for k in ("id", "name", "price"):
        assert k in c


# Auth login - verifies bcrypt + pyjwt
def test_login_returns_jwt(token):
    assert isinstance(token, str) and len(token.split(".")) == 3


def test_login_invalid():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code in (400, 401)


# Order creation - verifies MongoDB write
def test_create_order(api):
    payload = {
        "customer_name": "TEST_Customer",
        "phone": "9999999999",
        "cake_name": "Test Cake",
        "quantity": 1,
        "address": "123 Test Street",
        "notes": "TEST order"
    }
    # Try common variants
    r = api.post(f"{BASE_URL}/api/orders", json=payload)
    assert r.status_code == 200, f"{r.status_code} {r.text}"
    d = r.json()
    assert "id" in d


# Admin protected endpoint - verifies auth dependency
def test_admin_cakes(api, token):
    r = api.get(f"{BASE_URL}/api/admin/cakes",
                headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_cakes_no_auth(api):
    r = api.get(f"{BASE_URL}/api/admin/cakes")
    assert r.status_code in (401, 403)
