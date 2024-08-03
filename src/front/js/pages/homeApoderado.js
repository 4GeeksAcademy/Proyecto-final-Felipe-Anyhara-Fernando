import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

export const HomeApoderado = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [recomendaciones, setRecomendaciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await actions.obtenerAlumnoAsignaturas(); // Obtener todas las calificaciones
                const idAlumno = localStorage.getItem("userId") || 2; // Obtener el ID del alumno (ajusta según sea necesario)
                await actions.obtenerRecomendaciones(idAlumno);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        console.log("Store recomendaciones:", store.recomendaciones); // Log para verificar el contenido de store.recomendaciones
        setRecomendaciones(store.recomendaciones);
    }, [store.recomendaciones]);

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Apoderado Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className={`nav-link`} href="#" onClick={() => navigate("/")}>Inicio</a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-outline-danger" onClick={logout} type="button">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <div className="border border-secondary rounded p-4 bg-light">
                    <h2>Calificaciones</h2>
                    <ul>
                        {store.calificaciones.map(calificacion => (
                            <li key={calificacion.id}>
                                Alumno: {calificacion.nombre_alumno} {calificacion.apellido_alumno}, Asignatura: {calificacion.nombre_asignatura}, Calificación: {calificacion.calificacion}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border border-secondary rounded p-4 bg-light mt-4">
                    <h2>Recomendaciones</h2>
                    <ul>
                        {recomendaciones.length > 0 ? (
                            recomendaciones.map(recomendacion => (
                                <li key={recomendacion.id}>
                                    {recomendacion.texto}
                                </li>
                            ))
                        ) : (
                            <li>No hay recomendaciones disponibles</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
