import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import "../../styles/homeapoderado.css"; 

export const HomeApoderado = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [recomendacion, setRecomendacion] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            if (store.user && store.user.alumnos && store.user.alumnos.length > 0) {
                if (store.calificaciones.length === 0) {
                    await actions.obtenerAlumnoAsignaturas();
                }
                if (store.recomendaciones.length === 0) {
                    store.user.alumnos.map(async (alumno) => {
                        await actions.obtenerRecomendaciones(alumno.id);
                    });
                }
            }
        };
        if (store.user) {
            loadUserData();
        }
    }, [store.user]);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        setRecomendacion(store.recomendaciones);
    }, [store.recomendaciones]);

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const groupByAlumno = (calificaciones) => {
        return calificaciones.reduce((acc, calificacion) => {
            const { nombre_alumno, apellido_alumno } = calificacion;
            const nombreCompleto = `${nombre_alumno} ${apellido_alumno}`;
            if (!acc[nombreCompleto]) {
                acc[nombreCompleto] = {};
            }
            const { nombre_asignatura } = calificacion;
            if (!acc[nombreCompleto][nombre_asignatura]) {
                acc[nombreCompleto][nombre_asignatura] = [];
            }
            acc[nombreCompleto][nombre_asignatura].push(calificacion.calificacion);
            return acc;
        }, {});
    };

    const calificacionesAgrupadas = groupByAlumno(store.calificaciones);

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <h1 className="navbar-brand">Apoderado Dashboard</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-outline-danger" onClick={logout} type="button">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <div className="border border-secondary rounded p-4 bg-light">
                    <h2>Calificaciones</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Asignatura</th>
                                <th>Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(calificacionesAgrupadas).map(nombreAlumno => (
                                Object.keys(calificacionesAgrupadas[nombreAlumno]).map((nombreAsignatura, asignaturaIndex) => (
                                    calificacionesAgrupadas[nombreAlumno][nombreAsignatura].map((calificacion, index) => (
                                        <tr key={`${nombreAlumno}-${nombreAsignatura}-${index}`}>
                                            {asignaturaIndex === 0 && index === 0 && (
                                                <td rowSpan={Object.keys(calificacionesAgrupadas[nombreAlumno]).reduce((acc, curr) => acc + calificacionesAgrupadas[nombreAlumno][curr].length, 0)}>
                                                    {nombreAlumno}
                                                </td>
                                            )}
                                            {index === 0 && (
                                                <td rowSpan={calificacionesAgrupadas[nombreAlumno][nombreAsignatura].length}>
                                                    {nombreAsignatura}
                                                </td>
                                            )}
                                            <td>{calificacion}</td>
                                        </tr>
                                    ))
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="border border-secondary rounded p-4 bg-light mt-4 mb-4">
                    <h2>Recomendaciones</h2>
                    <ul>
                        {recomendacion.length > 0 ? (
                            recomendacion.map(reco => (
                                <li key={reco.id}>
                                    <ReactMarkdown>{reco.recomendacion}</ReactMarkdown>
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
