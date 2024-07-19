from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
db = SQLAlchemy(app)

# Importación de modelos
from models import Apoderado, Profesor, Asignatura, Alumno, AlumnoAsignatura, Recomendacion

# Endpoints para Apoderado
@app.route('/apoderado', methods=['POST'])
def create_apoderado():
    """
    Crea un nuevo apoderado.
    """
    data = request.json
    nuevo_apoderado = Apoderado(
        nombre=data['nombre'],
        apellido=data['apellido'],
        correo_electronico=data['correo_electronico'],
        contrasena=data['contrasena'],
        esta_activo=data.get('esta_activo', False),
        telefono=data.get('telefono'),
        direccion=data.get('direccion')
    )
    db.session.add(nuevo_apoderado)
    db.session.commit()
    return jsonify(nuevo_apoderado.serialize()), 201

@app.route('/apoderado/<int:id>', methods=['GET'])
def get_apoderado(id):
    """
    Obtiene los detalles de un apoderado específico por ID.
    """
    apoderado = Apoderado.query.get_or_404(id)
    return jsonify(apoderado.serialize())

@app.route('/apoderado/<int:id>', methods=['PUT'])
def update_apoderado(id):
    """
    Actualiza la información de un apoderado específico por ID.
    """
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

@app.route('/apoderado/<int:id>', methods=['DELETE'])
def delete_apoderado(id):
    """
    Elimina un apoderado específico por ID.
    """
    apoderado = Apoderado.query.get_or_404(id)
    db.session.delete(apoderado)
    db.session.commit()
    return '', 204

# Endpoints para Profesor
@app.route('/profesor', methods=['POST'])
def create_profesor():
    """
    Crea un nuevo profesor.
    """
    data = request.json
    nuevo_profesor = Profesor(
        nombre=data['nombre'],
        apellido=data['apellido'],
        correo_electronico=data['correo_electronico'],
        contrasena=data['contrasena'],
        esta_activo=data.get('esta_activo', False),
        titulo=data.get('titulo'),
        especializacion=data.get('especializacion')
    )
    db.session.add(nuevo_profesor)
    db.session.commit()
    return jsonify(nuevo_profesor.serialize()), 201

@app.route('/profesor/<int:id>', methods=['GET'])
def get_profesor(id):
    """
    Obtiene los detalles de un profesor específico por ID.
    """
    profesor = Profesor.query.get_or_404(id)
    return jsonify(profesor.serialize())

@app.route('/profesor/<int:id>', methods=['PUT'])
def update_profesor(id):
    """
    Actualiza la información de un profesor específico por ID.
    """
    data = request.json
    profesor = Profesor.query.get_or_404(id)
    profesor.nombre = data.get('nombre', profesor.nombre)
    profesor.apellido = data.get('apellido', profesor.apellido)
    profesor.correo_electronico = data.get('correo_electronico', profesor.correo_electronico)
    profesor.contrasena = data.get('contrasena', profesor.contrasena)
    profesor.esta_activo = data.get('esta_activo', profesor.esta_activo)
    profesor.titulo = data.get('titulo', profesor.titulo)
    profesor.especializacion = data.get('especializacion', profesor.especializacion)
    db.session.commit()
    return jsonify(profesor.serialize())

@app.route('/profesor/<int:id>', methods=['DELETE'])
def delete_profesor(id):
    """
    Elimina un profesor específico por ID.
    """
    profesor = Profesor.query.get_or_404(id)
    db.session.delete(profesor)
    db.session.commit()
    return '', 204

# Endpoints para Asignatura
@app.route('/asignatura', methods=['POST'])
def create_asignatura():
    """
    Crea una nueva asignatura.
    """
    data = request.json
    nueva_asignatura = Asignatura(
        nombre=data['nombre'],
        id_profesor=data['id_profesor']
    )
    db.session.add(nueva_asignatura)
    db.session.commit()
    return jsonify(nueva_asignatura.serialize()), 201

@app.route('/asignatura/<int:id>', methods=['GET'])
def get_asignatura(id):
    """
    Obtiene los detalles de una asignatura específica por ID.
    """
    asignatura = Asignatura.query.get_or_404(id)
    return jsonify(asignatura.serialize())

@app.route('/asignatura/<int:id>', methods=['PUT'])
def update_asignatura(id):
    """
    Actualiza la información de una asignatura específica por ID.
    """
    data = request.json
    asignatura = Asignatura.query.get_or_404(id)
    asignatura.nombre = data.get('nombre', asignatura.nombre)
    asignatura.id_profesor = data.get('id_profesor', asignatura.id_profesor)
    db.session.commit()
    return jsonify(asignatura.serialize())

@app.route('/asignatura/<int:id>', methods=['DELETE'])
def delete_asignatura(id):
    """
    Elimina una asignatura específica por ID.
    """
    asignatura = Asignatura.query.get_or_404(id)
    db.session.delete(asignatura)
    db.session.commit()
    return '', 204

# Endpoints para Alumno
@app.route('/alumno', methods=['POST'])
def create_alumno():
    """
    Crea un nuevo alumno.
    """
    data = request.json
    nuevo_alumno = Alumno(
        nombre=data['nombre'],
        apellido=data['apellido'],
        id_apoderado=data['id_apoderado'],
        esta_activo=data.get('esta_activo', False)
    )
    db.session.add(nuevo_alumno)
    db.session.commit()
    return jsonify(nuevo_alumno.serialize()), 201

@app.route('/alumno/<int:id>', methods=['GET'])
def get_alumno(id):
    """
    Obtiene los detalles de un alumno específico por ID.
    """
    alumno = Alumno.query.get_or_404(id)
    return jsonify(alumno.serialize())

@app.route('/alumno/<int:id>', methods=['PUT'])
def update_alumno(id):
    """
    Actualiza la información de un alumno específico por ID.
    Expects JSON with fields to update: nombre, apellido, id_apoderado, esta_activo.
    """
    data = request.json
    alumno = Alumno.query.get_or_404(id)
    alumno.nombre = data.get('nombre', alumno.nombre)
    alumno.apellido = data.get('apellido', alumno.apellido)
    alumno.id_apoderado = data.get('id_apoderado', alumno.id_apoderado)
    alumno.esta_activo = data.get('esta_activo', alumno.esta_activo)
    db.session.commit()
    return jsonify(alumno.serialize())

@app.route('/alumno/<int:id>', methods=['DELETE'])
def delete_alumno(id):
    """
    Elimina un alumno específico por ID.
    """
    alumno = Alumno.query.get_or_404(id)
    db.session.delete(alumno)
    db.session.commit()
    return '', 204

# Endpoints para AlumnoAsignatura
@app.route('/alumno_asignatura', methods=['POST'])
def create_alumno_asignatura():
    data = request.json
    nuevo_alumno_asignatura = AlumnoAsignatura(
        id_alumno=data['id_alumno'],
        id_asignatura=data['id_asignatura'],
        calificacion=data['calificacion']
    )
    db.session.add(nuevo_alumno_asignatura)
    db.session.commit()
    return jsonify(nuevo_alumno_asignatura.serialize()), 201

@app.route('/alumno_asignatura/<int:id>', methods=['GET'])
def get_alumno_asignatura(id):
    alumno_asignatura = AlumnoAsignatura.query.get_or_404(id)
    return jsonify(alumno_asignatura.serialize())

@app.route('/alumno_asignatura/<int:id>', methods=['PUT'])
def update_alumno_asignatura(id):
    data = request.json
    alumno_asignatura = AlumnoAsignatura.query.get_or_404(id)
    alumno_asignatura.id_alumno = data.get('id_alumno', alumno_asignatura.id_alumno)
    alumno_asignatura.id_asignatura = data.get('id_asignatura', alumno_asignatura.id_asignatura)
    alumno_asignatura.calificacion = data.get('calificacion', alumno_asignatura.calificacion)
    db.session.commit()
    return jsonify(alumno_asignatura.serialize())

@app.route('/alumno_asignatura/<int:id>', methods=['DELETE'])
def delete_alumno_asignatura(id):
    alumno_asignatura = AlumnoAsignatura.query.get_or_404(id)
    db.session.delete(alumno_asignatura)
    db.session.commit()
    return '', 204

# Endpoints para Recomendacion
@app.route('/recomendacion', methods=['POST'])
def create_recomendacion():
    data = request.json
    nueva_recomendacion = Recomendacion(
        id_alumno=data['id_alumno'],
        recomendacion=data['recomendacion']
    )
    db.session.add(nueva_recomendacion)
    db.session.commit()
    return jsonify(nueva_recomendacion.serialize()), 201

@app.route('/recomendacion/<int:id>', methods=['GET'])
def get_recomendacion(id):
    recomendacion = Recomendacion.query.get_or_404(id)
    return jsonify(recomendacion.serialize())

@app.route('/recomendacion/<int:id>', methods=['PUT'])
def update_recomendacion(id):
    data = request.json
    recomendacion = Recomendacion.query.get_or_404(id)
    recomendacion.id_alumno = data.get('id_alumno', recomendacion.id_alumno)
    recomendacion.recomendacion
