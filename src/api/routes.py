from flask import Flask, jsonify
from flask_cors import CORS
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from api.models import Apoderado, Profesor, Asignatura, Alumno, AlumnoAsignatura, Recomendacion, db
from flask_cors import CORS 
from dotenv import load_dotenv
import google.generativeai as genai
import os
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from api.models import Apoderado, Profesor, db

load_dotenv
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise EnvironmentError("La clave de API de Google no está configurada. Asegúrate de establecer la variable de entorno 'GOOGLE_API_KEY'.")
genai.configure(api_key = api_key)

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
            "apellido_alumno": alumno.apellido,
            "id_asignatura": registro.id_asignatura,
            "nombre_asignatura": asignatura.nombre,
            "calificacion": registro.calificacion
        })
    
    return jsonify(result), 200


@api.route('/alumnos-detalles', methods=['GET'])
def get_alumnos_con_detalles():
    try:
        apoderado_id = request.args.get('apoderado_id')
        if not apoderado_id:
            print("Apoderado ID es requerido")
            return jsonify({"mensaje": "Apoderado ID es requerido"}), 400

        alumnos = Alumno.query.filter_by(id_apoderado=apoderado_id).all()
        registros_asignatura = (
            db.session.query(AlumnoAsignatura, Alumno, Asignatura)
            .join(Alumno, AlumnoAsignatura.id_alumno == Alumno.id)
            .join(Asignatura, AlumnoAsignatura.id_asignatura == Asignatura.id)
            .filter(Alumno.id_apoderado == apoderado_id)
            .all()
        )
        
        alumnos_detalle = []
        for alumno in alumnos:
            alumno_info = {
                "id": alumno.id,
                "nombre": alumno.nombre,
                "apellido": alumno.apellido,
                "asignaturas": []
            }
            for registro, _, asignatura in registros_asignatura:
                if registro.id_alumno == alumno.id:
                    alumno_info["asignaturas"].append({
                        "id_asignatura": registro.id_asignatura,
                        "nombre_asignatura": asignatura.nombre,
                        "calificacion": registro.calificacion
                    })
            alumnos_detalle.append(alumno_info)
        
        print("Datos de alumnos con detalles: %s", alumnos_detalle)
        return jsonify(alumnos_detalle), 200

    except Exception as e:
        print("Error en la función get_alumnos_con_detalles: %s", str(e))
        return jsonify({"Error desde el backend": str(e)}), 500
    
@api.route('/gemini', methods=['POST'])
def get_gemini():
    # Obtener parámetros del cuerpo de la solicitud
    data = request.get_json()
    id_alumno = data.get('id_alumno')
    id_asignatura = data.get('id_asignatura')
    if not id_alumno or not id_asignatura:
        return jsonify({"error": "Se requieren los parámetros 'id_alumno' e 'id_asignatura'"}), 400
    try:
        # Convertir los parámetros a enteros
        id_alumno = int(id_alumno)
        id_asignatura = int(id_asignatura)
    except ValueError:
        return jsonify({"error": "Los parámetros deben ser enteros"}), 400
    # Calcular el promedio de las calificaciones del alumno en la asignatura
    promedio_calificacion = db.session.query(db.func.avg(AlumnoAsignatura.calificacion))\
        .filter(AlumnoAsignatura.id_alumno == id_alumno, AlumnoAsignatura.id_asignatura == id_asignatura)\
        .scalar()
    if promedio_calificacion is None:
        return jsonify({"error": "No se encontraron calificaciones para este alumno y asignatura"}), 404
    # Verificar el promedio de la calificación
    if promedio_calificacion < 4:
        # Obtener el nombre de la asignatura
        asignatura = Asignatura.query.get(id_asignatura)
        if not asignatura:
            return jsonify({"error": "Asignatura no encontrada"}), 404
        # Crear el contenido de la solicitud para el modelo de IA
        contenido = (
            f"Actuaras como un profesor de {asignatura.nombre} y debes darme una sugerencia de ejercicios prácticos y aplicables con el proposito de mejorar el rendimiento de un alumno. "
            f"{asignatura.nombre} es una asignatura que se imparte en tercero básico y es muy importante para el desarrollo cognitivo."
        )
        # Configurar el modelo de IA y generar el contenido
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(contenido)
        recomendacion_texto = response.text
        # Guardar la recomendación en la base de datos
        nueva_recomendacion = Recomendacion(
            id_alumno=id_alumno,
            recomendacion=recomendacion_texto
        )
        db.session.add(nueva_recomendacion)
        db.session.commit()
        # Devolver la recomendación generada
        return jsonify({
            "recomendacion": recomendacion_texto
        }), 200
    else:
        return jsonify({
            "mensaje": "La calificación esta por sobre el rango minimo exigido, por consecuencia no se requieren recomendaciones."
        }), 200
    
@api.route('/recomendaciones/<int:id_alumno>', methods=['GET'])
def obtener_recomendaciones(id_alumno):
    # Consultar todas las recomendaciones para el alumno especificado
    recomendaciones = Recomendacion.query.filter_by(id_alumno=id_alumno).all()
    if not recomendaciones:
        return jsonify({"mensaje": "No se encontraron recomendaciones para el alumno con ID {}".format(id_alumno)}), 404
    # Serializar las recomendaciones
    result = [recomendacion.serialize() for recomendacion in recomendaciones]
    return jsonify(result), 200

@api.route('/alumno_asignaturas/<int:id_alumno>', methods=['GET'])
def obtener_alumno_asignaturas_por_id_alumno(id_alumno):
    # Consultar todas las recomendaciones para el alumno especificado
    registros = AlumnoAsignatura.query.filter_by(id_alumno=id_alumno).all()
    if not registros:
        return jsonify({"mensaje": "No se encontraron registros para el alumno con ID {}".format(id_alumno)}), 404
    registros = (
        db.session.query(AlumnoAsignatura, Alumno, Asignatura)
        .join(Alumno, AlumnoAsignatura.id_alumno == id_alumno)
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