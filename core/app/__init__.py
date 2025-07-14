# core/app/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    CORS(app) 

    # DB
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fyrane.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    db.init_app(app)
    bcrypt.init_app(app)


    from .auth import auth_bp 
    app.register_blueprint(auth_bp) 

    @app.route('/')
    def home():
        return "Core is running."

    @app.route('/api/data')
    def get_data():
        return jsonify({"message": "Coreside status: 'Running'", "status": "success"})

    return app