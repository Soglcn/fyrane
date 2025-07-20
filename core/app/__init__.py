# core/app/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from .extensions import db, bcrypt

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fyrane.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)

    from .auth import auth_bp
    from .diskstats import system_bp
    from .adduser import users_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(users_bp)

    @app.route('/')
    def home():
        return "Core is running."

    @app.route('/api/data')
    def get_data():
        return jsonify({"message": "API Running", "status": "success"})

    @app.route('/api/users')
    def get_users():
        return jsonify({"message": "User added!"})

    return app
