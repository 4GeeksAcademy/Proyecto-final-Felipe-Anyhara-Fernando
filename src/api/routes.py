"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

import logging

# Configurar el logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@api.route('/register', methods=['POST'])
def handle_register():
    try:
        request_body = request.get_json()
        logger.info(f"Request Body: {request_body}")

        user_email = request_body.get("email", None)
        user_password = request_body.get("password", None)
        user_is_active = request_body.get("user_is_active", True)

        if not user_email or not user_password:
            return jsonify({"error": "Email and password are required"}), 401

        existent_user = User.query.filter_by(email=user_email).first()
        if existent_user:
            return jsonify({"error": "The user already exists"}), 401

        new_user = User(
            email=user_email,
            password=user_password,
            is_active=user_is_active
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.serialize()), 201
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

    
@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    print(f", ID: {user.id}, Password: {user.password}")
    return jsonify({"id": user.id, "email": user.email }), 200

@api.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"msg": "User not found"}), 404

        return jsonify({"user": user.serialize()}), 200
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api.route('/login', methods=['POST'])
def handle_login():
    try:
        request_body = request.get_json()
        email = request_body.get("email", None)
        password = request_body.get("password", None)

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.password == password:
            return jsonify({"msg": "Bad email or password"}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token}), 200
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

    