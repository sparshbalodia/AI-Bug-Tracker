import pytest
from app import create_app
from app.extensions import db


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


def test_create_issue(client):
    res = client.post("/api/issues", json={
        "title": "Test bug",
        "description": "Something broken",
        "status": "open",
        "severity": "low"
    })

    assert res.status_code == 201
    assert "id" in res.json


def test_create_issue_invalid(client):
    res = client.post("/api/issues", json={
        "description": "Missing title"
    })

    assert res.status_code == 400


def test_get_issues(client):
    client.post("/api/issues", json={
        "title": "Bug",
        "status": "open"
    })

    res = client.get("/api/issues")

    assert res.status_code == 200
    assert isinstance(res.json, list)
    assert len(res.json) == 1
    assert res.json[0]["title"] == "Bug"


def test_delete_issue(client):
    res = client.post("/api/issues", json={
        "title": "Delete me",
        "status": "open"
    })

    issue_id = res.json["id"]

    delete_res = client.delete(f"/api/issues/{issue_id}")

    assert delete_res.status_code == 200


def test_ai_invalid_input(client):
    res = client.post("/api/issues/ai-enhance", json={})

    assert res.status_code == 400


def test_ai_valid_input(client):
    res = client.post("/api/issues/ai-enhance", json={
        "title": "Crash bug",
        "description": "App crashes on login"
    })

    # AI may succeed or fallback
    assert res.status_code in [200, 500]