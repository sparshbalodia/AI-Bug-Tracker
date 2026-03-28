from marshmallow import Schema, fields, validate

class IssueSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str()

    status = fields.Str(
        validate=validate.OneOf(["open", "in_progress", "closed"])
    )

    severity = fields.Str(
        validate=validate.OneOf(["low", "medium", "high"])
    )