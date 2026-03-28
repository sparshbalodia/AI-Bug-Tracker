from flask import Flask, jsonify
from app.config import Config
from app.extensions import db
from app.utils.logger import setup_logger

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # setup logging
    setup_logger()

    # init database
    db.init_app(app)

    # register routes
    from app.routes.issue_routes import issue_bp
    from app.routes.health import health_bp

    app.register_blueprint(issue_bp, url_prefix="/api")
    app.register_blueprint(health_bp)

    # error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request"}), 400

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal Server Error"}), 500

    return app