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
        'company_id', 'username', 'password', 'fullname',
        'email', 'phone', 'role', 'profession'
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
    return jsonify([{
        '_id': user.id,
        'company_id': user.company_id,
        'username': user.username,
        'fullname': user.fullname,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'profession': user.profession
    } for user in users])

@users_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user_to_delete = db.session.get(User, user_id)
        if user_to_delete:
            db.session.delete(user_to_delete)
            db.session.commit()
            return jsonify({'message': f'User (ID: {user_id}) deleted successfully.'}), 200
        return jsonify({'message': f'User (ID: {user_id}) not found.'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error occurred while deleting user.'}), 500

@users_bp.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided for update'}), 400

    try:
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': f'User with ID {user_id} not found'}), 404

        for field, value in data.items():
            if field == 'password':
                user.set_password(value)
            elif hasattr(user, field):
                setattr(user, field, value)

        db.session.commit()

        return jsonify({
            'message': f'User with ID {user_id} updated successfully',
            '_id': user.id,
            'company_id': user.company_id,
            'username': user.username,
            'fullname': user.fullname,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'profession': user.profession
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while updating the user', 'details': str(e)}), 500
