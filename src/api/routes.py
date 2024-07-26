from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from api.models import Apoderado, Profesor, Alumno, AlumnoAsignatura, Recomendacion, db
from flask_cors import CORS 

api = Blueprint('api', __name__)

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from api.models import Apoderado, Profesor, db

api = Blueprint('api', __name__)

#Corregido: Generación de token de acceso, y obtener el tipo de usuario desde la columna rol
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo_electronico = data.get('correo_electronico')
    contrasena = data.get('contrasena')

    # Intentar encontrar el usuario en la tabla de Apoderado
    apoderado = Apoderado.query.filter_by(correo_electronico=correo_electronico).first()
    if apoderado and check_password_hash(apoderado.contrasena, contrasena):
        access_token = create_access_token(identity={'id': apoderado.id, 'rol': apoderado.rol})
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "id": apoderado.id,
            "rol": apoderado.rol,
            "access_token": access_token
        }), 200

    # Intentar encontrar el usuario en la tabla de Profesor
    profesor = Profesor.query.filter_by(correo_electronico=correo_electronico).first()
    if profesor and check_password_hash(profesor.contrasena, contrasena):
        access_token = create_access_token(identity={'id': profesor.id, 'rol': profesor.rol})
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "id": profesor.id,
            "rol": profesor.rol,
            "access_token": access_token
        }), 200

    # Si no se encuentran las credenciales en ninguna tabla
    return jsonify({"mensaje": "Credenciales incorrectas"}), 401

#Corregido
@api.route('/register/guardian', methods=['POST'])
def register_guardian():
    data = request.get_json()
    
    # Verificar si el JSON está presente
    if not data:
        return jsonify({"error": "No se proporcionaron datos"}), 400

    # Extraer los datos
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('correo_electronico')
    password = data.get('contrasena')
    telefono = data.get('telefono')
    direccion = data.get('direccion')
    
    # Verificar que los campos requeridos no estén vacíos
    if not nombre or not apellido or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Crear un nuevo apoderado con los campos presentes en models
    new_guardian = Apoderado(
        nombre=nombre,
        apellido=apellido,
        correo_electronico=email,
        contrasena=generate_password_hash(password),
        esta_activo=True,
        telefono=telefono,
        direccion=direccion,
        rol='Apoderado'
    )
    
    db.session.add(new_guardian)
    db.session.commit()
    
    return jsonify({"message": "Apoderado registrado exitosamente"}), 201

#Corregido
@api.route('/register/teacher', methods=['POST'])
def register_teacher():
    data = request.get_json()
    
    # Verificar si el JSON está presente
    if not data:
        return jsonify({"error": "No se proporcionaron datos"}), 400

    # Extraer los datos
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('correo_electronico')
    password = data.get('contrasena')
    titulo = data.get('titulo')
    especializacion = data.get('especializacion')
    
    # Verificar que los campos requeridos no estén vacíos
    if not nombre or not apellido or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Crear un nuevo profesor con los campos presentes en models
    new_teacher = Profesor(
        nombre=nombre,
        apellido=apellido,
        correo_electronico=email,
        contrasena=generate_password_hash(password),
        esta_activo=True,
        rol='Profesor',
        titulo=titulo,
        especializacion=especializacion
    )
    
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

#Recomendación: ruta para obtener todos los profesores

@api.route('/teachers', methods=['GET'])
def get_teachers():
    profesores = Profesor.query.all()
    return jsonify([profesor.serialize() for profesor in profesores]), 200

#Recomendación: ruta para obtener todos los profesores por el id:

@api.route('/teacher/<int:id>', methods=['GET'])
def get_teacher(id):
    profesor = Profesor.query.get_or_404(id)
    return jsonify(profesor.serialize()), 200

#Recomendación: ruta para obtener todos los apoderados

@api.route('/guardians', methods=['GET'])
def get_guardians():
    apoderados = Apoderado.query.all()
    return jsonify([apoderado.serialize() for apoderado in apoderados]), 200

#Recomendación: ruta para obtener todos los profesores por el id:

@api.route('/guardian/<int:id>', methods=['GET'])
def get_guardian(id):
    apoderado = Apoderado.query.get_or_404(id)
    return jsonify(apoderado.serialize()), 200
