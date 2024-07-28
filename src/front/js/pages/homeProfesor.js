import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

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
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => setActiveTab("home")}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => setActiveTab("calificaciones")}>Calificaciones</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => setActiveTab("asignaturas")}>Asignaturas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => setActiveTab("alumnos")}>Alumnos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => setActiveTab("apoderados")}>Apoderados</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            <h1 className="text-center">Profesor Dashboard</h1>
            {renderContent()}
            <div className="row">
                <div className="col-md-6">
                    <h2>Agregar Asignatura</h2>
                    <input 
                        type="text" 
                        placeholder="Nombre de la asignatura" 
                        value={asignatura} 
                        onChange={(e) => setAsignatura(e.target.value)} 
                    />
                    <button onClick={handleAddAsignatura}>Agregar</button>
                </div>
                <div className="col-md-6">
                    <h2>Agregar Calificación</h2>
                    <select
                        className="form-control"
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
                        className="form-control"
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
                    <input 
                        type="text" 
                        placeholder="Calificación" 
                        value={calificacion} 
                        onChange={(e) => setCalificacion(e.target.value)} 
                    />
                    <button onClick={handleAddCalificacion}>Agregar</button>
                </div>
                <div className="col-md-6">
                    <h2>Agregar Apoderado</h2>
                    <input 
                        type="text" 
                        placeholder="Nombre" 
                        value={nombreApoderado} 
                        onChange={(e) => setNombreApoderado(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Apellido" 
                        value={apellidoApoderado} 
                        onChange={(e) => setApellidoApoderado(e.target.value)} 
                    />
                    <input 
                        type="email" 
                        placeholder="Correo Electrónico" 
                        value={correoApoderado} 
                        onChange={(e) => setCorreoApoderado(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={contrasenaApoderado} 
                        onChange={(e) => setContrasenaApoderado(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Teléfono" 
                        value={telefonoApoderado} 
                        onChange={(e) => setTelefonoApoderado(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Dirección" 
                        value={direccionApoderado} 
                        onChange={(e) => setDireccionApoderado(e.target.value)} 
                    />
                    <button onClick={handleAddApoderado}>Agregar</button>
                </div>
                <div className="col-md-6">
                    <h2>Agregar Alumno</h2>
                    <input 
                        type="text" 
                        placeholder="Nombre" 
                        value={nombreAlumno} 
                        onChange={(e) => setNombreAlumno(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Apellido" 
                        value={apellidoAlumno} 
                        onChange={(e) => setApellidoAlumno(e.target.value)} 
                    />
                    <select
                        className="form-control"
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
                    <label>
                        <input 
                            type="checkbox"
                            checked={estaActivo}
                            onChange={(e) => setEstaActivo(e.target.checked)}
                        />
                        ¿Está activo?
                    </label>
                    <button onClick={handleAddAlumno}>Agregar</button>
                </div>
            </div>
        </div>
    );
};
