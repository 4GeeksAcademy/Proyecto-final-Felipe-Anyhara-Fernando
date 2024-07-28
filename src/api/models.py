from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, Text, Float, Table
from sqlalchemy.orm import relationship, declarative_base

db = SQLAlchemy()
Base = declarative_base()

class Apoderado(db.Model):
    __tablename__ = 'apoderado'
    id = db.Column(db.Integer, primary_key=True)  
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=False)
    correo_electronico = db.Column(db.String(120), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False) 
    esta_activo = db.Column(db.Boolean, nullable=False, default=False)
    telefono = db.Column(db.String(20), nullable=True)
    direccion = db.Column(db.Text, nullable=True)
    alumnos = relationship('Alumno', backref='apoderado', lazy=True)
    rol = db.Column(db.String(120), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "correo_electronico": self.correo_electronico,
            "esta_activo": self.esta_activo,
            "telefono": self.telefono,
            "direccion": self.direccion,
            "rol": self.rol,
            "alumnos": [alumno.serialize() for alumno in self.alumnos]
        }

class Profesor(db.Model):
    __tablename__ = 'profesor'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=False)
    correo_electronico = db.Column(db.String(120), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)
    esta_activo = db.Column(db.Boolean, nullable=False, default=False)
    titulo = db.Column(db.String(120), nullable=True)
    especializacion = db.Column(db.String(120), nullable=True)
    asignaturas = relationship('Asignatura', backref='profesor', lazy=True)
    rol = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "correo_electronico": self.correo_electronico,
            "esta_activo": self.esta_activo,
            "titulo": self.titulo,
            "especializacion": self.especializacion,
            "rol": self.rol,
            "asignaturas": [asignatura.serialize() for asignatura in self.asignaturas]
        }

class Asignatura(db.Model):
    __tablename__ = 'asignatura'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    id_profesor = db.Column(db.Integer, db.ForeignKey('profesor.id'))
    calificaciones = relationship('AlumnoAsignatura', backref='asignatura', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }
        
class Alumno(db.Model):
    __tablename__ = 'alumno'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=False)
    id_apoderado = db.Column(db.Integer, db.ForeignKey('apoderado.id'), nullable=False)
    esta_activo = db.Column(db.Boolean, nullable=False, default=False)
    asignaturas = relationship('AlumnoAsignatura', backref='alumno', lazy=True)
    recomendaciones = relationship('Recomendacion', backref='alumno', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "esta_activo": self.esta_activo,
        }

class AlumnoAsignatura(db.Model):
    __tablename__ = 'alumno_asignatura'
    id = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey('alumno.id'), nullable=False)
    id_asignatura = db.Column(db.Integer, db.ForeignKey('asignatura.id'), nullable=False)
    calificacion = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "calificacion": self.calificacion
        }

class Recomendacion(db.Model):
    __tablename__ = 'recomendacion'
    id = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey('alumno.id'), nullable=False)
    recomendacion = db.Column(db.Text, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "alumno": self.alumno.serialize() if self.alumno else None,
            "recomendacion": self.recomendacion
        }
