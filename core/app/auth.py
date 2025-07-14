# core/auth.py
from flask import Blueprint, request, jsonify
from .models import User 


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    company_id = data.get('companyId')
    username = data.get('username')
    password = data.get('password')

    if not company_id or not username or not password:
        return jsonify({"message": "Company ID, username, and password are required"}), 400


    user = User.query.filter_by(username=username, company_id=company_id).first()

    if user:

        if user.check_password(password):

            return jsonify({
                "message": "Login successful",
                "user": {
                    "username": user.username,
                    "companyId": user.company_id,
                    "fullname": user.fullname,
                    "email": user.email,
                    "role": user.role
                }
            }), 200
        else:

            return jsonify({"message": "Invalid username or password"}), 401
    else:
        return jsonify({"message": "Invalid company ID or username or password"}), 401