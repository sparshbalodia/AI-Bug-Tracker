import json

from app.schemas.ai_schema import AIEnhanceSchema
from flask import Blueprint, request, jsonify
from app.services.ai_service import enhance_issue
from app.services.issue_service import (
    create_issue,
    get_all_issues,
    get_issue_by_id,
    update_issue,
    delete_issue
)
from app.schemas.issue_schema import IssueSchema

issue_bp = Blueprint("issues", __name__)
schema = IssueSchema()
ai_schema = AIEnhanceSchema()

@issue_bp.route("/issues", methods=["POST"])
def create():
    data = request.json

    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400

    issue = create_issue(data)
    return jsonify({"id": issue.id}), 201


@issue_bp.route("/issues", methods=["GET"])
def get_all():
    issues = get_all_issues()

    return jsonify([
        {
            "id": i.id,
            "title": i.title,
            "status": i.status,
            "severity": i.severity
        } for i in issues
    ])


@issue_bp.route("/issues/<int:id>", methods=["GET"])
def get_one(id):
    issue = get_issue_by_id(id)

    if not issue:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "id": issue.id,
        "title": issue.title,
        "status": issue.status
    })


@issue_bp.route("/issues/<int:id>", methods=["PUT"])
def update(id):
    data = request.json

    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400

    issue = update_issue(id, data)

    if not issue:
        return jsonify({"error": "Not found"}), 404

    return jsonify({"message": "updated"})


@issue_bp.route("/issues/<int:id>", methods=["DELETE"])
def delete(id):
    success = delete_issue(id)

    if not success:
        return jsonify({"error": "Not found"}), 404

    return jsonify({"message": "deleted"})
  

@issue_bp.route("/issues/ai-enhance", methods=["POST"])
def ai_enhance():
    data = request.json or {}

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"error": "title required"}), 400

    raw_output = enhance_issue(title, description)

    try:
        parsed = json.loads(raw_output)
    except Exception:
        return jsonify({
          "error": "Invalid AI response",
          "raw": raw_output
          }), 500

    errors = ai_schema.validate(parsed)
    if errors:
        return jsonify({"error": "AI output invalid", "details": errors}), 500

    return jsonify(parsed)