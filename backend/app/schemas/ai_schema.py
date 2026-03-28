from marshmallow import Schema, fields, validate

class AIEnhanceSchema(Schema):
    severity = fields.Str(
        required=True,
        validate=validate.OneOf(["low", "medium", "high"])
    )

    repro_steps = fields.List(fields.Str(), required=True)

    possible_cause = fields.Str(required=True)