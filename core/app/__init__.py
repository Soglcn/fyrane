# core/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app) 

    @app.route('/')
    def home():
        return "Core is running."

    @app.route('/api/data')
    def get_data():
        return jsonify({"message": "Coreside status: 'Running'", "status": "success"})

    return app