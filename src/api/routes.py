from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from api.models import Apoderado, Profesor, Asignatura, Alumno, AlumnoAsignatura, Recomendacion, db
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

@api.route('/asignaturas', methods=['POST'])
def agregar_asignatura():
    data = request.get_json()
    nombre = data.get('nombre')
    id_profesor = data.get('id_profesor')

    if not nombre or not id_profesor:
        return jsonify({'error': 'Nombre y ID del profesor son requeridos'}), 400

    profesor = Profesor.query.get(id_profesor)
    if not profesor:
        return jsonify({'error': 'Profesor no encontrado'}), 404

    nueva_asignatura = Asignatura(nombre=nombre, id_profesor=id_profesor)
    db.session.add(nueva_asignatura)
    db.session.commit()

    return jsonify(nueva_asignatura.serialize()), 201

@api.route('/asignaturas', methods=['GET'])
def obtener_asignaturas():
    asignaturas = Asignatura.query.all()
    return jsonify([asignatura.serialize() for asignatura in asignaturas]), 200

@api.route('/asignaturas/<int:id>', methods=['DELETE'])
def eliminar_asignatura(id):
    asignatura = Asignatura.query.get(id)
    if not asignatura:
        return jsonify({'error': 'Asignatura no encontrada'}), 404

    db.session.delete(asignatura)
    db.session.commit()
    
    return jsonify({'message': 'Asignatura eliminada exitosamente'}), 200

@api.route('/alumnos', methods=['POST'])
def agregar_alumno():
    data = request.get_json()

    # Validar datos requeridos
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    id_apoderado = data.get('id_apoderado')
    esta_activo = data.get('esta_activo', False)

    if not nombre or not apellido or not id_apoderado:
        return jsonify({'error': 'Nombre, apellido e ID del apoderado son requeridos'}), 400

    # Verificar que el apoderado existe
    apoderado = Apoderado.query.get(id_apoderado)
    if not apoderado:
        return jsonify({'error': 'Apoderado no encontrado'}), 404

    # Crear nuevo alumno
    nuevo_alumno = Alumno(
        nombre=nombre,
        apellido=apellido,
        id_apoderado=id_apoderado,
        esta_activo=esta_activo
    )

    db.session.add(nuevo_alumno)
    db.session.commit()

    return jsonify(nuevo_alumno.serialize()), 201

@api.route('/alumnos', methods=['GET'])
def obtener_alumnos():
    alumnos = Alumno.query.all()
    return jsonify([alumno.serialize() for alumno in alumnos]), 200

@api.route('/alumno_asignaturas', methods=['POST'])
def agregar_alumno_asignatura():
    data = request.get_json()

    # Validar datos requeridos
    id_alumno = data.get('id_alumno')
    id_asignatura = data.get('id_asignatura')
    calificacion = data.get('calificacion')

    if not id_alumno or not id_asignatura or calificacion is None:
        return jsonify({'error': 'ID de alumno, ID de asignatura y calificación son requeridos'}), 400

    # Verificar que el alumno existe
    alumno = Alumno.query.get(id_alumno)
    if not alumno:
        return jsonify({'error': 'Alumno no encontrado'}), 404

    # Verificar que la asignatura existe
    asignatura = Asignatura.query.get(id_asignatura)
    if not asignatura:
        return jsonify({'error': 'Asignatura no encontrada'}), 404

    # Crear nuevo registro de alumno_asignatura
    nuevo_registro = AlumnoAsignatura(
        id_alumno=id_alumno,
        id_asignatura=id_asignatura,
        calificacion=calificacion
    )

    db.session.add(nuevo_registro)
    db.session.commit()

    return jsonify(nuevo_registro.serialize()), 201

@api.route('/alumno_asignaturas', methods=['GET'])
def obtener_alumno_asignaturas():
    registros = (
        db.session.query(AlumnoAsignatura, Alumno, Asignatura)
        .join(Alumno, AlumnoAsignatura.id_alumno == Alumno.id)
        .join(Asignatura, AlumnoAsignatura.id_asignatura == Asignatura.id)
        .all()
    )
    
    result = []
    for registro, alumno, asignatura in registros:
        result.append({
            "id": registro.id,
            "id_alumno": registro.id_alumno,
            "nombre_alumno": alumno.nombre,
            "id_asignatura": registro.id_asignatura,
            "nombre_asignatura": asignatura.nombre,
            "calificacion": registro.calificacion
        })
    
    return jsonify(result), 200