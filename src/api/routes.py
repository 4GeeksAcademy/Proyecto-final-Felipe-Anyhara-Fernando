from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from api.models import Apoderado, Profesor, Alumno, AlumnoAsignatura, Recomendacion, db
from flask_cors import CORS 

api = Blueprint('api', __name__)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo_electronico = data.get('correo_electronico')
    contrasena = data.get('contrasena')

    apoderado = Apoderado.query.filter_by(correo_electronico=correo_electronico).first()
    if apoderado and check_password_hash(apoderado.contrasena, contrasena):
        return jsonify({"mensaje": "Inicio de sesión exitoso", "tipo_usuario": "apoderado", "id": apoderado.id}), 200

    profesor = Profesor.query.filter_by(correo_electronico=correo_electronico).first()
    if profesor and check_password_hash(profesor.contrasena, contrasena):
        return jsonify({"mensaje": "Inicio de sesión exitoso", "tipo_usuario": "profesor", "id": profesor.id}), 200

    return jsonify({"mensaje": "Credenciales incorrectas"}), 401

@api.route('/register/guardian', methods=['POST'])
def register_guardian():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    new_guardian = Apoderado(correo_electronico=email, contrasena=generate_password_hash(password), esta_activo=True)
    db.session.add(new_guardian)
    db.session.commit()
    
    return jsonify({"message": "Apoderado registrado exitosamente"}), 201

@api.route('/register/teacher', methods=['POST'])
def register_teacher():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    nombre = data.get('name')
    apellido = data.get('lastName')
    
    new_teacher = Profesor(nombre= nombre, apellido=apellido, correo_electronico=email, contrasena=generate_password_hash(password), esta_activo=True)
    db.session.add(new_teacher)
    db.session.commit()
    
    return jsonify({"message": "Profesor registrado exitosamente"}), 201

# Otros endpoints (asegúrate de que estén bien definidos)
@api.route('/apoderado/<int:id>', methods=['GET'])
def get_apoderado(id):
    apoderado = Apoderado.query.get_or_404(id)
    return jsonify(apoderado.serialize())

@api.route('/apoderado/<int:id>', methods=['PUT'])
def update_apoderado(id):
    data = request.json
    apoderado = Apoderado.query.get_or_404(id)
    apoderado.nombre = data.get('nombre', apoderado.nombre)
    apoderado.apellido = data.get('apellido', apoderado.apellido)
    apoderado.correo_electronico = data.get('correo_electronico', apoderado.correo_electronico)
    apoderado.contrasena = data.get('contrasena', apoderado.contrasena)
    apoderado.esta_activo = data.get('esta_activo', apoderado.esta_activo)
    apoderado.telefono = data.get('telefono', apoderado.telefono)
    apoderado.direccion = data.get('direccion', apoderado.direccion)
    db.session.commit()
    return jsonify(apoderado.serialize())

@api.route('/apoderado/<int:id>', methods=['DELETE'])
def delete_apoderado(id):
    apoderado = Apoderado.query.get_or_404(id)
    db.session.delete(apoderado)
    db.session.commit()
    return '', 204
