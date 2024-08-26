import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
export const HomeApoderado = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [recomendacion, setRecomendacion] = useState([]);
    useEffect(() => {
        const loadUserData = async () => {
            // Verificamos que los datos del usuario y los alumnos estén disponibles
            if (store.user && store.user.alumnos && store.user.alumnos.length > 0) {
                const apoderado = store.user.nombre + " " + store.user.apellido;
                console.log("apoderado: ",store.calificaciones)
                // Si el apoderado es Catalina Norambuena
                
                        // Almacenamos el ID del alumno Conor McGregor en el localStorage
                        //localStorage.setItem("userId", alumnoConor.id);
                        //console.log("Alumno encontrado:", alumnoConor);
                        // Obtenemos las calificaciones si no están en el store
                        if (store.calificaciones.length === 0) {
                            await actions.obtenerAlumnoAsignaturas();
                        }
                        // Obtenemos las recomendaciones si no están en el store
                        if (store.recomendaciones.length === 0) {
                            store.user.alumnos.map(async (alumno)=>{
                                await actions.obtenerRecomendaciones(alumno.id);
                            })
                        }
            }
        };
        // Ejecutar la función si los datos del usuario están cargados
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
        console.log("Store recomendaciones:", store.recomendaciones);
        setRecomendacion(store.recomendaciones);
    }, [store.recomendaciones]);
    console.log("recomendacion:", recomendacion);
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
                        {recomendacion.length > 0 ? (
                            recomendacion.map(recomendacion => (
                                <li key={recomendacion.id}>
                                    {recomendacion.recomendacion}
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

