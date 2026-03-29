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


def test_create_issue(client):
    res = client.post("/api/issues", json={
        "title": "Test bug",
        "description": "Something broken",
        "status": "open",
        "severity": "low"
    })

    assert res.status_code == 201


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


def test_ai_invalid_input(client):
    res = client.post("/api/issues/ai-enhance", json={})

    assert res.status_code == 400