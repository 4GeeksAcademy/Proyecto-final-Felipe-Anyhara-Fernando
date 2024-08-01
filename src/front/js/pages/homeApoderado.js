import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const HomeApoderado = () => {
    const { store, actions } = useContext(Context);
    const [alumnosConAsignaturasYCalificaciones, setAlumnosConAsignaturasYCalificaciones] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apoderadoId = localStorage.getItem("userId");
                if (!apoderadoId) {
                    console.error("Apoderado ID no encontrado en localStorage");
                    return;
                }

                const response = await actions.getAlumnosConDetalles(apoderadoId);
                if (Array.isArray(response)) {
                    setAlumnosConAsignaturasYCalificaciones(response);
                } else {
                    console.error("Los datos obtenidos no son un arreglo");
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [actions]);

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-warning">
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex justify-content-between align-items-center fs-3 font-monospace" to="/">SMART BRAIN</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse d-flex justify-content-center align-items-center" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Volver Al Inicio</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Menú
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link className="dropdown-item" to="/calificaciones">Calificaciones</Link></li>
                                    <li><Link className="dropdown-item" to="/avance">Avance Curricular</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/recomendaciones' ? 'active' : ''}`} to="/recomendaciones">Recomendaciones</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Buscar</button>
                        </form>
                        <button type="button" onClick={logout} className="btn btn-danger">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
            <strong><h1>Bienvenidos Apoderados</h1></strong>

            <div className="table-responsive black">
                <h2>Alumnos, Asignaturas y Calificaciones</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Asignatura</th>
                            <th>Calificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnosConAsignaturasYCalificaciones.map(alumno => (
                            <React.Fragment key={alumno.id}>
                                {alumno.asignaturas.map(asignatura => (
                                    <tr key={`${alumno.id}-${asignatura.id_asignatura}`}>
                                        <td>{alumno.nombre} {alumno.apellido}</td>
                                        <td>{asignatura.nombre_asignatura}</td>
                                        <td>{asignatura.calificacion}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
