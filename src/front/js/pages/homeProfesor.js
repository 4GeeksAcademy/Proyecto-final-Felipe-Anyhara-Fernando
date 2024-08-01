import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

export const HomeProfesor = () => {
    const { store, actions } = useContext(Context);
    const [asignatura, setAsignatura] = useState("");
    const [calificacion, setCalificacion] = useState("");
    const [idAsignatura, setIdAsignatura] = useState("");
    const [idAlumno, setIdAlumno] = useState("");
    const [nombreApoderado, setNombreApoderado] = useState("");
    const [apellidoApoderado, setApellidoApoderado] = useState("");
    const [correoApoderado, setCorreoApoderado] = useState("");
    const [contrasenaApoderado, setContrasenaApoderado] = useState("");
    const [telefonoApoderado, setTelefonoApoderado] = useState("");
    const [direccionApoderado, setDireccionApoderado] = useState("");
    const [nombreAlumno, setNombreAlumno] = useState("");
    const [apellidoAlumno, setApellidoAlumno] = useState("");
    const [idApoderado, setIdApoderado] = useState("");
    const [estaActivo, setEstaActivo] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await actions.getAsignaturas();
                await actions.getAlumnos();
                await actions.getApoderados(); 
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")){
            navigate("/")
        }
    }, []);

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const handleAddAsignatura = async () => {
        const profesorId = localStorage.getItem("userId");
        await actions.addAsignatura(profesorId, asignatura);
        setAsignatura(""); 
    };

    const handleAddCalificacion = async () => {
        await actions.addCalificacion(idAlumno, idAsignatura, calificacion);
        setCalificacion(""); 
    };

    const handleAddApoderado = async () => {
        await actions.registerGuardian(
            nombreApoderado,
            apellidoApoderado,
            correoApoderado,
            contrasenaApoderado,
            telefonoApoderado,
            direccionApoderado
        );

        await actions.getApoderados();

        setNombreApoderado("");
        setApellidoApoderado("");
        setCorreoApoderado("");
        setContrasenaApoderado("");
        setTelefonoApoderado("");
        setDireccionApoderado("");
    };

    const handleAddAlumno = async () => {
        await actions.registerAlumno(
            nombreAlumno,
            apellidoAlumno,
            idApoderado,
            estaActivo
        );

        setNombreAlumno("");
        setApellidoAlumno("");
        setIdApoderado("");
        setEstaActivo(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "asignaturas":
                return (
                    <div>
                        <h2>Asignaturas</h2>
                        <ul>
                            {store.asignaturas.map(asignatura => (
                                <li key={asignatura.id}>{asignatura.nombre}</li>
                            ))}
                        </ul>
                    </div>
                );
            case "alumnos":
                return (
                    <div>
                        <h2>Alumnos</h2>
                        <ul>
                            {store.alumnos.map(alumno => (
                                <li key={alumno.id}>{alumno.nombre} {alumno.apellido}</li>
                            ))}
                        </ul>
                    </div>
                );
            case "calificaciones":
                return (
                    <div>
                        <h2>Calificaciones</h2>
                        <ul>
                            {store.calificaciones.map(calificacion => (
                                <li key={calificacion.id}>
                                    Alumno: {calificacion.id_alumno}, Asignatura: {calificacion.id_asignatura}, Calificación: {calificacion.calificacion}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "apoderados":
                return (
                    <div>
                        <h2>Apoderados</h2>
                        <ul>
                            {store.apoderados.map(apoderado => (
                                <li key={apoderado.id}>{apoderado.nombre} {apoderado.apellido}</li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return (
                    <div>
                        <h2>Bienvenido a la página de inicio</h2>
                        <p>Seleccione una opción del menú para comenzar.</p>
                    </div>
                );
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Profesor Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "home" ? "active" : ""}`} href="#" onClick={() => setActiveTab("home")}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "calificaciones" ? "active" : ""}`} href="#" onClick={() => setActiveTab("calificaciones")}>Calificaciones</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "asignaturas" ? "active" : ""}`} href="#" onClick={() => setActiveTab("asignaturas")}>Asignaturas</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "alumnos" ? "active" : ""}`} href="#" onClick={() => setActiveTab("alumnos")}>Alumnos</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "apoderados" ? "active" : ""}`} href="#" onClick={() => setActiveTab("apoderados")}>Apoderados</a>
                            </li>
                        </ul>
                        <button className="btn btn-outline-success" onClick={logout} type="button">Logout</button>
                    </div>
                </div>
            </nav>
            <div className="container my-4">
                {renderContent()}
            </div>
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <h2>Agregar Asignatura</h2>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nombre de la asignatura" 
                                value={asignatura} 
                                onChange={(e) => setAsignatura(e.target.value)} 
                            />
                            <button className="btn btn-primary" onClick={handleAddAsignatura}>Agregar</button>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2>Agregar Calificación</h2>
                        <select
                            className="form-select mb-2"
                            value={idAsignatura}
                            onChange={(e) => setIdAsignatura(e.target.value)}
                        >
                            <option value="">Seleccione una asignatura</option>
                            {store.asignaturas.map((asignatura) => (
                                <option key={asignatura.id} value={asignatura.id}>
                                    {asignatura.nombre}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select mb-2"
                            value={idAlumno}
                            onChange={(e) => setIdAlumno(e.target.value)}
                        >
                            <option value="">Seleccione un alumno</option>
                            {store.alumnos.map((alumno) => (
                                <option key={alumno.id} value={alumno.id}>
                                    {alumno.nombre} {alumno.apellido}
                                </option>
                            ))}
                        </select>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Calificación" 
                                value={calificacion} 
                                onChange={(e) => setCalificacion(e.target.value)} 
                            />
                            <button className="btn btn-primary" onClick={handleAddCalificacion}>Agregar</button>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2>Agregar Apoderado</h2>
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nombre del apoderado" 
                                value={nombreApoderado} 
                                onChange={(e) => setNombreApoderado(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Apellido del apoderado" 
                                value={apellidoApoderado} 
                                onChange={(e) => setApellidoApoderado(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="Correo electrónico del apoderado" 
                                value={correoApoderado} 
                                onChange={(e) => setCorreoApoderado(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Contraseña del apoderado" 
                                value={contrasenaApoderado} 
                                onChange={(e) => setContrasenaApoderado(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="tel" 
                                className="form-control" 
                                placeholder="Teléfono del apoderado" 
                                value={telefonoApoderado} 
                                onChange={(e) => setTelefonoApoderado(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Dirección del apoderado" 
                                value={direccionApoderado} 
                                onChange={(e) => setDireccionApoderado(e.target.value)} 
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddApoderado}>Agregar</button>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2>Agregar Alumno</h2>
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nombre del alumno" 
                                value={nombreAlumno} 
                                onChange={(e) => setNombreAlumno(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Apellido del alumno" 
                                value={apellidoAlumno} 
                                onChange={(e) => setApellidoAlumno(e.target.value)} 
                            />
                        </div>
                        <select
                            className="form-select mb-2"
                            value={idApoderado}
                            onChange={(e) => setIdApoderado(e.target.value)}
                        >
                            <option value="">Seleccione un apoderado</option>
                            {store.apoderados.map((apoderado) => (
                                <option key={apoderado.id} value={apoderado.id}>
                                    {apoderado.nombre} {apoderado.apellido}
                                </option>
                            ))}
                        </select>
                        <div className="form-check mb-2">
                            <input 
                                type="checkbox" 
                                className="form-check-input" 
                                id="estaActivo" 
                                checked={estaActivo} 
                                onChange={(e) => setEstaActivo(e.target.checked)} 
                            />
                            <label className="form-check-label" htmlFor="estaActivo">¿Está activo?</label>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddAlumno}>Agregar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
