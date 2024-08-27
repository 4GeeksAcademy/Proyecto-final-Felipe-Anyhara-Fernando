import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons"; // Importa los íconos


export const HomeProfesor = () => {
    const { store, actions } = useContext(Context);
    const [asignatura, setAsignatura] = useState("");
    const [recomendacion, setRecomendacion] = useState("");
    const [mensaje, setMensaje] = useState(null);
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
    const [activeTab, setActiveTab] = useState("apoderados"); // Pestaña inicial seleccionada
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await actions.getAsignaturas();
                await actions.getAlumnos();
                await actions.getApoderados();
                await actions.obtenerAlumnoAsignaturasProfesor(); // Obtener todas las calificaciones
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate("/")
        }
    }, []);

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };

    // Funciones para cada acción
    const handleAddAlumno = async () => {
        if (nombreAlumno.trim() && apellidoAlumno.trim() && idApoderado) {
            try {
                await actions.registerAlumno(
                    nombreAlumno,
                    apellidoAlumno,
                    idApoderado,
                    estaActivo
                );
                // Clear form fields
                setNombreAlumno("");
                setApellidoAlumno("");
                setIdApoderado("");
                setEstaActivo(false);
                toast.success("Alumno agregado con éxito");
                setActiveTab("asignaturas"); // Cambiar a la pestaña de asignaturas
            } catch (error) {
                console.error("Error adding alumno", error);
                toast.error("Error al agregar alumno");
            }
        } else {
            toast.error("Por favor, complete todos los campos");
        }
    };
    
    
    const handleAddApoderado = async () => {
        if (
            nombreApoderado.trim() &&
            apellidoApoderado.trim() &&
            correoApoderado.trim() &&
            contrasenaApoderado.trim() &&
            telefonoApoderado.trim() &&
            direccionApoderado.trim()
        ) {
            try {
                await actions.registerGuardian(
                    nombreApoderado,
                    apellidoApoderado,
                    correoApoderado,
                    contrasenaApoderado,
                    telefonoApoderado,
                    direccionApoderado
                );
                await actions.getApoderados(); // Refresh apoderados list
                // Clear form fields
                setNombreApoderado("");
                setApellidoApoderado("");
                setCorreoApoderado("");
                setContrasenaApoderado("");
                setTelefonoApoderado("");
                setDireccionApoderado("");
                toast.success("Apoderado agregado con éxito");
                setActiveTab("alumnos"); // Cambiar a la pestaña de alumnos
            } catch (error) {
                console.error("Error adding apoderado", error);
                toast.error("Error al agregar apoderado");
            }
        } else {
            toast.error("Por favor, complete todos los campos");
        }
    };
    
    
    const handleAddAsignatura = async () => {
        if (asignatura.trim() === "") {
            toast.error("El nombre de la asignatura no puede estar vacío");
            return;
        }
        try {
            const profesorId = localStorage.getItem("userId");
            await actions.addAsignatura(profesorId, asignatura);
            setAsignatura("");
            toast.success("Asignatura agregada con éxito");
            setActiveTab("calificaciones"); // Cambiar a la pestaña de calificaciones
        } catch (error) {
            console.error("Error adding asignatura", error);
            toast.error("Error al agregar asignatura");
        }
    };
    
    
    const handleAddCalificacion = async () => {
        if (idAlumno && idAsignatura && calificacion.trim() !== "") {
            try {
                await actions.addCalificacion(idAlumno, idAsignatura, calificacion);
                setCalificacion("");
                toast.success("Calificación agregada con éxito");
                setActiveTab("recomendaciones"); // Cambiar a la pestaña de recomendaciones
            } catch (error) {
                console.error("Error adding calificacion", error);
                toast.error("Error al agregar calificación");
            }
        } else {
            toast.error("Por favor, complete todos los campos");
        }
    };
    
    

    const handleGenerateRecomendacion = async () => {
        try {
            const data = await actions.generateRecomendacion(idAlumno, idAsignatura);
            if (data.recomendacion) {
                setRecomendacion(data.recomendacion);
                setMensaje(null);
                toast.success("Recomendación generada con éxito");
            } else if (data.mensaje) {
                setMensaje(data.mensaje);
                setRecomendacion(null);
                toast.error(data.mensaje);
            }
        } catch (error) {
            console.error("Error al generar recomendación:", error);
            toast.error("La calificación esta por sobre el rango minimo exigido, por consecuencia no se requieren recomendaciones.");
        }
    };

    // Renderizado del contenido según la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case "alumnos":
                return (
                    <div>
                        <h2>Alumnos</h2>
                        <ul className="list-group">
                            {store.alumnos && store.alumnos.length > 0 ? (
                                store.alumnos.map(alumno => (
                                    <li key={alumno.id} className="list-group-item">
                                        {alumno.nombre} {alumno.apellido}
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">No hay alumnos disponibles</li>
                            )}
                        </ul>
                        <div className="mt-4">
                            <h3>Agregar Alumno</h3>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={nombreAlumno}
                                    onChange={(e) => setNombreAlumno(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Apellido"
                                    value={apellidoAlumno}
                                    onChange={(e) => setApellidoAlumno(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    value={idApoderado}
                                    onChange={(e) => setIdApoderado(e.target.value)}
                                >
                                    <option value="">Seleccione un apoderado</option>
                                    {store.apoderados && store.apoderados.map((apoderado) => (
                                        <option key={apoderado.id} value={apoderado.id}>
                                            {apoderado.nombre} {apoderado.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={estaActivo}
                                    onChange={(e) => setEstaActivo(e.target.checked)}
                                />
                                <label className="form-check-label">¿Está activo?</label>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddAlumno}>Agregar</button>
                        </div>
                    </div>
                );
            case "apoderados":
                return (
                    <div>
                        <h2>Apoderados</h2>
                        <ul className="list-group">
                            {store.apoderados && store.apoderados.length > 0 ? (
                                store.apoderados.map(apoderado => (
                                    <li key={apoderado.id} className="list-group-item">
                                        {apoderado.nombre} {apoderado.apellido}
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">No hay apoderados disponibles</li>
                            )}
                        </ul>
                        <div className="mt-4">
                            <h3>Agregar Apoderado</h3>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={nombreApoderado}
                                    onChange={(e) => setNombreApoderado(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Apellido"
                                    value={apellidoApoderado}
                                    onChange={(e) => setApellidoApoderado(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Correo Electrónico"
                                    value={correoApoderado}
                                    onChange={(e) => setCorreoApoderado(e.target.value)}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    value={contrasenaApoderado}
                                    onChange={(e) => setContrasenaApoderado(e.target.value)}
                                />
                                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Teléfono"
                                    value={telefonoApoderado}
                                    onChange={(e) => setTelefonoApoderado(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Dirección"
                                    value={direccionApoderado}
                                    onChange={(e) => setDireccionApoderado(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleAddApoderado}>Agregar</button>
                        </div>
                    </div>
                );
            case "asignaturas":
                return (
                    <div>
                        <h2>Asignaturas</h2>
                        <ul className="list-group">
                            {store.asignaturas && store.asignaturas.length > 0 ? (
                                store.asignaturas.map(asignatura => (
                                    <li key={asignatura.id} className="list-group-item">
                                        {asignatura.nombre}
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">No hay asignaturas disponibles</li>
                            )}
                        </ul>
                        <div className="mt-4">
                            <h3>Agregar Asignatura</h3>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la asignatura"
                                    value={asignatura}
                                    onChange={(e) => setAsignatura(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleAddAsignatura}>Agregar</button>
                        </div>
                    </div>
                );
            case "calificaciones":
                return (
                    <div>
                        <h2>Calificaciones</h2>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={idAlumno}
                                onChange={(e) => setIdAlumno(e.target.value)}
                            >
                                <option value="">Seleccione un alumno</option>
                                {store.alumnos && store.alumnos.map((alumno) => (
                                    <option key={alumno.id} value={alumno.id}>
                                        {alumno.nombre} {alumno.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={idAsignatura}
                                onChange={(e) => setIdAsignatura(e.target.value)}
                            >
                                <option value="">Seleccione una asignatura</option>
                                {store.asignaturas && store.asignaturas.map((asignatura) => (
                                    <option key={asignatura.id} value={asignatura.id}>
                                        {asignatura.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Calificación"
                                value={calificacion}
                                onChange={(e) => setCalificacion(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddCalificacion}>Agregar</button>
                    </div>
                );
            case "recomendaciones":
                return (
                    <div>
                        <h2>Generar Recomendaciones</h2>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={idAlumno}
                                onChange={(e) => setIdAlumno(e.target.value)}
                            >
                                <option value="">Seleccione un alumno</option>
                                {store.alumnos && store.alumnos.map((alumno) => (
                                    <option key={alumno.id} value={alumno.id}>
                                        {alumno.nombre} {alumno.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={idAsignatura}
                                onChange={(e) => setIdAsignatura(e.target.value)}
                            >
                                <option value="">Seleccione una asignatura</option>
                                {store.asignaturas && store.asignaturas.map((asignatura) => (
                                    <option key={asignatura.id} value={asignatura.id}>
                                        {asignatura.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary mb-4" onClick={handleGenerateRecomendacion}>Generar Recomendación</button>
                        {mensaje && <p>{mensaje}</p>}
                        {recomendacion && <ReactMarkdown>{recomendacion}</ReactMarkdown>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <h1 className="navbar-brand">Profesor Dashboard</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "apoderados" ? "active" : ""}`} href="#" onClick={() => setActiveTab("apoderados")}>1. Apoderados <FontAwesomeIcon className="ms-2" icon={faArrowRight} /></a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "alumnos" ? "active" : ""}`} href="#" onClick={() => setActiveTab("alumnos")}>2. Alumnos <FontAwesomeIcon className="ms-2" icon={faArrowRight} /> </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "asignaturas" ? "active" : ""}`} href="#" onClick={() => setActiveTab("asignaturas")}>3. Asignaturas <FontAwesomeIcon className="ms-2" icon={faArrowRight} /></a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "calificaciones" ? "active" : ""}`} href="#" onClick={() => setActiveTab("calificaciones")}>4. Calificaciones <FontAwesomeIcon className="ms-2" icon={faArrowRight} /></a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "recomendaciones" ? "active" : ""}`} href="#" onClick={() => setActiveTab("recomendaciones")}>5. Recomendaciones</a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-outline-danger" onClick={logout} type="button">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <div className="border border-secondary rounded p-4 bg-light mb-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
