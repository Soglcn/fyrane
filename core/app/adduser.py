from flask import Blueprint, request, jsonify
from .models import User
from . import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    required_fields = [
        'company_id',
        'username',
        'password',
        'fullname',
        'email',
        'phone',
        'role',
        'profession'
    ]

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'There is a missing entry at Required Fields'}), 400

    if User.query.filter_by(company_id=data['company_id'], username=data['username']).first():
        return jsonify({'error': 'Username has been taken for this Company!'}), 409

    if User.query.filter_by(company_id=data['company_id'], email=data['email']).first():
        return jsonify({'error': 'This E-mail has been taken for this Company'}), 409

    user = User(
        company_id=data['company_id'],
        username=data['username'],
        fullname=data['fullname'],
        email=data['email'],
        phone=data['phone'],
        role=data['role'],
        profession=data['profession']
    )
    user.set_password(data['password'])

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

    return jsonify({'message': 'User successfully added', 'username': user.username}), 201

@users_bp.route('/api/check-users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        users_list.append({
            'id': user.id,
            'company_id': user.company_id,
            'username': user.username,
            'fullname': user.fullname,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'profession': user.profession
        })
    return jsonify(users_list)