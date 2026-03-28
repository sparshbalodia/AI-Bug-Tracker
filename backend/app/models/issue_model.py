from app.extensions import db

class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)

    status = db.Column(db.String(20), nullable=False, default="open")
    severity = db.Column(db.String(20))

    created_at = db.Column(db.DateTime, server_default=db.func.now())